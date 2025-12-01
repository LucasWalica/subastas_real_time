# auctions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Item, Auction, AuctionItem, Bid, ItemGranted
from .serializers import ItemSerializer, AuctionSerializer, BidSerializer, ItemGrantedSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework import serializers

# -------------------
# Items
# -------------------

class ItemCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer

    def perform_create(self, serializer):
        serializer.save()

class ItemListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer

    def get_queryset(self):
        return Item.objects.filter(auctionitem__auction__owner=self.request.user).distinct()

class ItemDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    def perform_destroy(self, instance):
        # solo permitir eliminar si no está en subasta activa
        if AuctionItem.objects.filter(item=instance, auction__is_closed=False).exists():
            raise serializers.ValidationError("No puedes eliminar un item que está en una subasta activa")
        instance.delete()

#falta update item



# -------------------
# Auctions
# -------------------

class AuctionCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer

    def create(self, request, *args, **kwargs):
        items_ids = request.data.get('items', [])
        auction = Auction.objects.create(
            owner=request.user,
            start_time=request.data['start_time'],
            end_time=request.data['end_time'],
            is_live=request.data.get('is_live', False)
        )
        for item_id in items_ids:
            item = get_object_or_404(Item, id=item_id)
            AuctionItem.objects.create(auction=auction, item=item, starting_price=item.starting_price)
        serializer = self.get_serializer(auction)
        return Response(serializer.data, status=201)

# posible añadir paginacion
class AuctionListActiveView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AuctionSerializer

    def get_queryset(self):
        return Auction.objects.filter(is_closed=False)

class AuctionUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer
    queryset = Auction.objects.all()

    def get_object(self):
        auction = get_object_or_404(Auction, id=self.kwargs['pk'], owner=self.request.user)
        return auction

class AuctionDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer
    queryset = Auction.objects.all()

    def get_object(self):
        auction = get_object_or_404(Auction, id=self.kwargs['pk'], owner=self.request.user)
        return auction

# -------------------
# Bids
# -------------------

class BidCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BidSerializer

    def create(self, request, *args, **kwargs):
        auction_item = get_object_or_404(AuctionItem, id=request.data['auction_item'])
        amount = request.data['amount']
        user = request.user

        if user.token_balance < amount:
            return Response({"error":"No tienes suficientes tokens"}, status=400)

        highest_bid = auction_item.bids.first()
        if highest_bid and amount <= highest_bid.amount:
            return Response({"error":"La puja debe ser mayor a la actual"}, status=400)

        bid = Bid.objects.create(auction_item=auction_item, user=user, amount=amount)
        # opcional: restar tokens temporalmente
        user.token_balance -= amount
        user.save()

        serializer = self.get_serializer(bid)
        return Response(serializer.data, status=201)

class BidListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BidSerializer

    def get_queryset(self):
        auction_item_id = self.kwargs['auction_item_id']
        return Bid.objects.filter(auction_item_id=auction_item_id).order_by('-amount', 'created_at')

# -------------------
# Items Granted
# -------------------

class ItemGrantedListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemGrantedSerializer

    def get_queryset(self):
        return ItemGranted.objects.filter(winner=self.request.user)
