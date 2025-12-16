from django.db import transaction
from .models import Auction, ItemGranted, AuctionItem

# This function contains the correct logic for closing an auction.
# It should be called by a Celery task or other backend processes.
def close_auction_logic(auction_id):
    try:
        with transaction.atomic():
            # Use select_for_update to lock the auction row during the transaction
            auction = Auction.objects.select_for_update().get(id=auction_id, is_closed=False)

            for auction_item in auction.auctionitem_set.all():
                # The highest bid is the first one due to the default ordering in the Bid model
                highest_bid = auction_item.bids.first()

                if highest_bid:
                    winner = highest_bid.user

                    # Create the record of the item being granted
                    ItemGranted.objects.create(
                        auction_item=auction_item,
                        winner=winner,
                        amount=highest_bid.amount
                    )
                    auction_item.is_awarded = True
                    auction_item.save()

                    # Refund tokens to all losing bidders
                    losing_bids = auction_item.bids.exclude(id=highest_bid.id)
                    for bid in losing_bids:
                        bid.user.token_balance += bid.amount
                        bid.user.save()

            # Mark the auction as closed
            auction.is_closed = True
            auction.is_live = False # Also mark as not live
            auction.save()
            print(f"Auction {auction.id} closed successfully.")
            return {"success": True, "message": f"Auction {auction.id} closed successfully."}

    except Auction.DoesNotExist:
        print(f"Attempted to close auction {auction_id}, but it was already closed or does not exist.")
        return {"error": f"Auction {auction_id} already closed or invalid."}
