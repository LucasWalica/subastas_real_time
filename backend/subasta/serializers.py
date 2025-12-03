# auctions/serializers.py
from rest_framework import serializers
from .models import Item, Auction, AuctionItem, Bid, ItemGranted

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ['owner']

class AuctionItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = AuctionItem
        fields = '__all__'

class AuctionSerializer(serializers.ModelSerializer):
    items = AuctionItemSerializer(source='auctionitem_set', many=True, read_only=True)

    class Meta:
        model = Auction
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Bid
        fields = '__all__'

class ItemGrantedSerializer(serializers.ModelSerializer):
    auction_item = AuctionItemSerializer(read_only=True)
    winner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ItemGranted
        fields = '__all__'
