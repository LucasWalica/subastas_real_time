from django.db import models
from django.contrib.auth import get_user_model
from django.db import transaction
# Create your models here.

User = get_user_model()


# item 
class Item(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    img = models.URLField(blank=True)
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
    CATEGORY_CHOICES = [
        ('Todas', 'Todas'),
        ('Arte y Antigüedades', 'Arte y Antigüedades'),
        ('Tecnología', 'Tecnología'),
        ('Joyería', 'Joyería'),
        ('Vehículos', 'Vehículos'),
        ('Muebles', 'Muebles'),
        ('Coleccionables', 'Coleccionables'),
        ('Ropa y Accesorios', 'Ropa y Accesorios'),
        ('Deportes', 'Deportes'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Todas')
    end_time = models.DateTimeField()
    is_real_time = models.BooleanField(default=False)
    is_live = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)

    def __str__(self):
        return f"Auction {self.id}"

    

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
    PAYMENT_STATUS_CHOICES = [
        ('Pending','Pending'),
        ('Paid','Paid'),
        ('Confirmed','Confirmed'),
        ('Dispute','Dispute')
    ]
    
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.winner.username} won {self.auction.item.name}"
