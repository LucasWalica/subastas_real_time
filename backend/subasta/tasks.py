from celery import shared_task
from django.utils import timezone
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Auction
from .services import close_auction_logic

@shared_task
def close_finished_auctions():
    """
    Scans for auctions that have ended but are not yet marked as closed.
    It then calls the logic to close them, grant items, and refund tokens.
    """
    now = timezone.now()
    # Find auctions that have passed their end_time and are not yet closed
    finished_auctions = Auction.objects.filter(
        end_time__lte=now,
        is_closed=False
    )

    if not finished_auctions.exists():
        print("No auctions to close at this time.")
        return

    print(f"Found {finished_auctions.count()} auctions to close.")

    for auction in finished_auctions:
        print(f"Closing auction {auction.id}...")
        result = close_auction_logic(auction.id)

        # After closing, notify clients via WebSocket
        if result.get("success"):
            channel_layer = get_channel_layer()
            group_name = f'auction_{auction.id}'
            
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'auction_close',
                    'message': f'The auction "{auction.id}" has been closed.'
                }
            )
            print(f"Sent close notification to group {group_name}")