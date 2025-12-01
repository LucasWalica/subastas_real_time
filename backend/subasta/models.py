from django.db import models
from django.contrib.auth import get_user_model
from django.db import transaction
# Create your models here.

User = get_user_model()


# item 
class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    starting_price = models.PositiveIntegerField()  # en tokens
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    
# item subastado 
class Auction(models.Model):
    items = models.ManyToManyField(Item, through='AuctionItem', related_name='auctions')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_live = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)

    def close_auction(self):
        if self.is_closed:
            return

        with transaction.atomic():  # asegura atomicidad
            for auction_item in self.auctionitem_set.all():
                highest_bid = auction_item.bids.first()  # gracias al ordering, es la más alta
                if highest_bid:
                    winner = highest_bid.user
                    if winner.token_balance >= highest_bid.amount:
                        winner.token_balance -= highest_bid.amount
                        winner.save()

                        ItemGranted.objects.create(
                            auction_item=auction_item,
                            winner=winner,
                            amount=highest_bid.amount
                        )
                        auction_item.is_awarded = True
                        auction_item.save()
                    else:
                        # Si no tiene suficientes tokens, puedes notificar o marcar como sin adjudicar
                        auction_item.is_awarded = False
                        auction_item.save()
            self.is_closed = True
            self.save()


    def __str__(self):
        return f"Auction: {self.item.name} ({self.id})"
    

class AuctionItem(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    starting_price = models.PositiveIntegerField()  # opcional, permite override
    is_awarded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.item.name} in auction {self.auction.id}"
    
# puja 
class Bid(models.Model):
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='bids')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()  # tokens usados
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount', 'created_at']

    def __str__(self):
        return f"{self.user.username} bid {self.amount} on {self.auction_item.item.name}"
    
# item concedido 
class ItemGranted(models.Model):
    auction = models.OneToOneField(AuctionItem, on_delete=models.CASCADE)
    winner = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()  # la puja ganadora
    granted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.winner.username} won {self.auction.item.name}"
