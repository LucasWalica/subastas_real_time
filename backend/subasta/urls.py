from .views import (
    ItemCreateWithImageView, ItemListView, ItemDeleteView,ItemUpdateView,
    AuctionCreateView, AuctionListActiveView, AuctionListByOwnerView,
    AuctionUpdateView, AuctionDeleteView,
    BidCreateView, BidListView,
    ItemGrantedListView,
    WebRTCICEServersView,
)
from django.urls import path 



urlpatterns = [
    # -------------------
    # Items
    # -------------------
    path("items/", ItemListView.as_view(), name="item-list"),
    path("items/create/", ItemCreateWithImageView.as_view(), name="item-create"),
    path("items/<int:pk>/delete/", ItemDeleteView.as_view(), name="item-delete"),
    path("items/<int:pk>/update/", ItemUpdateView.as_view(), name="item-update"),

    # -------------------
    # Auctions
    # -------------------
    path("auctions/owner/", AuctionListByOwnerView.as_view(), name="auction-list-by-owner"),
    path("auctions/", AuctionListActiveView.as_view(), name="auction-list-active"),
    path("auctions/create/", AuctionCreateView.as_view(), name="auction-create"),
    path("auctions/<int:pk>/update/", AuctionUpdateView.as_view(), name="auction-update"),
    path("auctions/<int:pk>/delete/", AuctionDeleteView.as_view(), name="auction-delete"),

    # -------------------
    # Bids
    # -------------------
    path("bids/<int:auction_item_id>/", BidListView.as_view(), name="bid-list"),
    path("bids/<int:auction_item_id>/place-bid/", BidCreateView.as_view(), name="bid-create"),
    
    # -------------------
    # Items Granted
    # -------------------
    path("granted/", ItemGrantedListView.as_view(), name="item-granted-list"),
    path("webrtc/ice-servers/", WebRTCICEServersView.as_view(), name="webrtc-ice-servers"),
]
