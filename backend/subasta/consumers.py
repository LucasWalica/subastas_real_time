import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db import transaction
from .models import Auction, AuctionItem, Bid
from .services import close_auction_logic # Import the new service function

class AuctionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['auction_id']
        self.auction_group_name = f'auction_{self.auction_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.auction_group_name,
            self.channel_name
        )

        await self.accept()

        # Send current auction state
        auction_state = await self.get_auction_state()
        await self.send_json({
            "type": "auction_state",
            "state": auction_state
        })

        # Send initial list of bids
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

        if not user.is_authenticated:
            await self.send_json({"error": "User not authenticated"})
            return

        message_type = data.get("type")

        if message_type == 'place_bid':
            auction_item_id = data.get("auction_item_id")
            amount = data.get("amount")

            if not auction_item_id or not isinstance(amount, int) or amount <= 0:
                await self.send_json({"error": "Invalid auction_item_id or amount"})
                return

            result = await self.place_bid(user, auction_item_id, amount)
            
            # If bid is successful, broadcast it to the group
            if "success" in result:
                await self.channel_layer.group_send(
                    self.auction_group_name,
                    {
                        "type": "bid_broadcast",
                        "bid": result
                    }
                )
            else:
                # Send error back to the user who made the bid
                await self.send_json(result)


    # Handlers for channel layer messages
    async def bid_broadcast(self, event):
        # Send bid to the WebSocket
        await self.send_json({
            "type": "new_bid",
            "bid": event["bid"]
        })

    async def auction_close(self, event):
        # This is triggered by the Celery task
        await self.send_json({
            "type": "auction_closed",
            "message": event["message"]
        })

    # ----------------------------
    # Database Methods
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
        try:
            with transaction.atomic():
                auction_item = AuctionItem.objects.select_for_update().get(
                    id=auction_item_id, auction__id=self.auction_id, auction__is_closed=False
                )

                # Check if the auction is still live
                if not auction_item.auction.is_live:
                    return {"error": "Auction is not live."}

                highest_bid = auction_item.bids.first()
                if highest_bid and amount <= highest_bid.amount:
                    return {"error": "Bid must be higher than the current highest bid."}

                if user.token_balance < amount:
                    return {"error": "Insufficient tokens."}

                # Deduct tokens and create the bid
                user.token_balance -= amount
                user.save(update_fields=['token_balance'])
                
                bid = Bid.objects.create(user=user, auction_item=auction_item, amount=amount)

                return {
                    "success": True,
                    "user": user.username,
                    "amount": amount,
                    "auction_item": auction_item.item.name,
                    "bid_id": bid.id
                }

        except AuctionItem.DoesNotExist:
            return {"error": "This auction item is not available."}
