from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CustomUser(AbstractUser):
    # Balance de tokens dentro del usuario
    token_balance = models.PositiveIntegerField(default=0)
    is_banned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)