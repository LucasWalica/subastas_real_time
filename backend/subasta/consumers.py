import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db import transaction
from .models import Auction, AuctionItem, Bid, ItemGranted

class AuctionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['auction_id']
        self.auction_group_name = f'auction_{self.auction_id}'

        # Unir al grupo
        await self.channel_layer.group_add(
            self.auction_group_name,
            self.channel_name
        )

        await self.accept()

        # Enviar estado de subasta
        auction_state = await self.get_auction_state()
        await self.send_json({
            "type": "auction_state",
            "state": auction_state
        })

        # Enviar lista inicial de pujas
        bids = await self.get_bids_list()
        await self.send_json({
            "type": "bid_list",
            "bids": bids
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.auction_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        user = self.scope["user"]

        # Validar usuario autenticado
        if not user.is_authenticated:
            await self.send_json({"error": "User not authenticated"})
            return

        auction_item_id = data.get("auction_item_id")
        amount = data.get("amount")

        if not auction_item_id or not isinstance(amount, int) or amount <= 0:
            await self.send_json({"error": "Invalid auction_item_id or amount"})
            return

        result = await self.place_bid(user, auction_item_id, amount)
        await self.send_json(result)

        if "success" in result:
            # Enviar puja a todos los clientes conectados
            await self.channel_layer.group_send(
                self.auction_group_name,
                {
                    "type": "bid_message",
                    "message": result
                }
            )

    async def bid_message(self, event):
        await self.send_json(event["message"])

    # ----------------------------
    # Métodos Sync-to-Async
    # ----------------------------
    @database_sync_to_async
    def get_auction_state(self):
        try:
            auction = Auction.objects.get(id=self.auction_id)
            return {
                "is_live": auction.is_live,
                "is_closed": auction.is_closed
            }
        except Auction.DoesNotExist:
            return {"is_live": False, "is_closed": True}

    @database_sync_to_async
    def get_bids_list(self):
        bids = Bid.objects.filter(
            auction_item__auction_id=self.auction_id
        ).order_by('-amount', 'created_at')

        return [
            {
                "user": bid.user.username,
                "amount": bid.amount,
                "auction_item": bid.auction_item.item.name,
                "bid_id": bid.id
            }
            for bid in bids
        ]

    @database_sync_to_async
    def place_bid(self, user, auction_item_id, amount):
        from django.contrib.auth import get_user_model
        User = get_user_model()  # <-- obtener aquí, dentro de la función

        try:
            with transaction.atomic():
                auction_item = AuctionItem.objects.select_for_update().get(
                    id=auction_item_id, auction__id=self.auction_id, auction__is_closed=False
                )

                highest_bid = auction_item.bids.first()
                if highest_bid and amount <= highest_bid.amount:
                    return {"error": "Bid must be higher than current highest"}

                if user.token_balance < amount:
                    return {"error": "Not enough tokens"}

                bid = Bid.objects.create(user=user, auction_item=auction_item, amount=amount)
                user.token_balance -= amount
                user.save()

                return {
                    "success": True,
                    "user": user.username,
                    "amount": amount,
                    "auction_item": auction_item.item.name,
                    "bid_id": bid.id
                }

        except AuctionItem.DoesNotExist:
            return {"error": "Invalid auction item"}

    @database_sync_to_async
    def close_auction(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()  # <-- obtener aquí también

        try:
            with transaction.atomic():
                auction = Auction.objects.select_for_update().get(id=self.auction_id, is_closed=False)

                for auction_item in auction.auctionitem_set.all():
                    highest_bid = auction_item.bids.first()
                    if highest_bid:
                        winner = highest_bid.user
                        # sanity check
                        if winner.token_balance + highest_bid.amount >= 0:
                            ItemGranted.objects.create(
                                auction_item=auction_item,
                                winner=winner,
                                amount=highest_bid.amount
                            )
                            auction_item.is_awarded = True
                            auction_item.save()

                            # Reembolsar a los perdedores
                            all_bids = auction_item.bids.exclude(id=highest_bid.id)
                            for bid in all_bids:
                                bid.user.token_balance += bid.amount
                                bid.user.save()

                auction.is_closed = True
                auction.save()
                return {"success": True, "message": "Auction closed"}

        except Auction.DoesNotExist:
            return {"error": "Auction already closed or invalid"}
