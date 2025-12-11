# auctions/serializers.py
from rest_framework import serializers
from .models import Item, Auction, AuctionItem, Bid, ItemGranted

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ['owner', 'img', 'created_at']

class AuctionItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = AuctionItem
        fields = '__all__'


class AuctionSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), many=True, write_only=True)

    class Meta:
        model = Auction
        fields = '__all__'
        read_only_fields = ['owner', 'is_closed', 'is_live']

    def validate(self, data):
        items = data.get('items', [])
        is_real_time = data.get('is_real_time', False)

        if len(items) > 1 and not is_real_time:
            raise serializers.ValidationError("Una subasta con varios items debe ser en tiempo real.")

        if len(items) == 0:
            raise serializers.ValidationError("Debe haber al menos un item en la subasta.")

        return data

    def create(self, validated_data):
        items = validated_data.pop('items', [])
        auction = Auction.objects.create(**validated_data)
        for item in items:
            AuctionItem.objects.create(
                auction=auction,
                item=item,
                starting_price=item.starting_price
            )
        return auction

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
