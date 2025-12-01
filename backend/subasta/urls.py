from .views import (
    ItemCreateView, ItemListView, ItemDeleteView,
    AuctionCreateView, AuctionListActiveView, AuctionUpdateView, AuctionDeleteView,
    BidCreateView, BidListView,
    ItemGrantedListView,
)
from django.urls import path 



urlpatterns = [
    # -------------------
    # Items
    # -------------------
    path("items/", ItemListView.as_view(), name="item-list"),
    path("items/create/", ItemCreateView.as_view(), name="item-create"),
    path("items/<int:pk>/delete/", ItemDeleteView.as_view(), name="item-delete"),

    # -------------------
    # Auctions
    # -------------------
    path("auctions/", AuctionListActiveView.as_view(), name="auction-list-active"),
    path("auctions/create/", AuctionCreateView.as_view(), name="auction-create"),
    path("auctions/<int:pk>/update/", AuctionUpdateView.as_view(), name="auction-update"),
    path("auctions/<int:pk>/delete/", AuctionDeleteView.as_view(), name="auction-delete"),

    # -------------------
    # Bids
    # -------------------
    path("bids/<int:auction_item_id>/", BidListView.as_view(), name="bid-list"),
    path("bids/create/", BidCreateView.as_view(), name="bid-create"),

    # -------------------
    # Items Granted
    # -------------------
    path("granted/", ItemGrantedListView.as_view(), name="item-granted-list"),
]
