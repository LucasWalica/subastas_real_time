from django.contrib import admin
from .models import Item, Auction, AuctionItem, Bid, ItemGranted
# Register your models here.

admin.site.register(Item)
admin.site.register(Auction)
admin.site.register(AuctionItem)
admin.site.register(Bid)
admin.site.register(ItemGranted)

