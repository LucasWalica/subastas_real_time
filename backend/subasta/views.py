# auctions/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Item, Auction, AuctionItem, Bid, ItemGranted
from .serializers import ItemSerializer, AuctionSerializer, BidSerializer, ItemGrantedSerializer
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from firebase_admin import storage
import uuid
# -------------------
# Items
# -------------------

class ItemCreateWithImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Recuperar campos de item
        name = request.data.get("name")
        description = request.data.get("description", "")
        starting_price = request.data.get("starting_price")
        file = request.FILES.get("file")  # imagen

        if not name or not starting_price:
            return Response({"error": "Missing required fields"}, status=400)

        img_url = ""
        if file:
            # generar nombre único
            filename = f"items/{uuid.uuid4()}_{file.name}"
            bucket = storage.bucket()
            blob = bucket.blob(filename)
            blob.upload_from_file(file, content_type=file.content_type)
            blob.make_public()
            img_url = blob.public_url

        # Crear el item
        item = Item.objects.create(
            owner=request.user,
            name=name,
            description=description,
            starting_price=starting_price,
            img=img_url
        )

        serializer = ItemSerializer(item)
        return Response(serializer.data, status=201)


class ItemListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer

    def get_queryset(self):
        return Item.objects.filter(owner=self.request.user)


class ItemDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    def perform_destroy(self, instance):
        # solo permitir eliminar si no está en subasta activa
        if AuctionItem.objects.filter(item=instance, auction__is_closed=False).exists():
            raise serializers.ValidationError("No puedes eliminar un item que está en una subasta activa")
        instance.delete()

#falta update item
class ItemUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    def get_object(self):
        item = get_object_or_404(Item, id=self.kwargs['pk'], owner=self.request.user)
        return item



# -------------------
# Auctions
# -------------------
class AuctionCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer

    def perform_create(self, serializer):
        items_ids = self.request.data.get('items', [])

        if not items_ids:
            raise serializers.ValidationError("Debes añadir al menos un item a la subasta")

        auction = serializer.save(owner=self.request.user)

        for item_id in items_ids:
            item = get_object_or_404(Item, id=item_id)

            item = get_object_or_404(Item, id=item_id)

    # Verificar que el item no esté en subastas activas
            if AuctionItem.objects.filter(item=item, auction__is_closed=False).exists():
                raise serializers.ValidationError(f"El item '{item.name}' ya está en una subasta activa")
            
            AuctionItem.objects.create(
                auction=auction,
                item=item,
                starting_price=item.starting_price,
            )



# posible añadir paginacion
class AuctionListActiveView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AuctionSerializer

    def get_queryset(self):
        queryset = Auction.objects.filter(is_closed=False)
        is_real_time_param = self.request.query_params.get('is_real_time')

        if is_real_time_param is not None:
            # Convertimos el string a booleano
            if is_real_time_param.lower() in ['true', '1', 't', 'yes']:
                is_real_time = True
            elif is_real_time_param.lower() in ['false', '0', 'f', 'no']:
                is_real_time = False
            else:
                raise ValidationError({"is_real_time": "Valor inválido. Debe ser true o false."})

            queryset = queryset.filter(is_real_time=is_real_time)

        return queryset
    

class AuctionListByOwnerView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer
    
    def get_queryset(self):
        return Auction.objects.filter(owner=self.request.user)
    

class AuctionUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer
    queryset = Auction.objects.all()

    def get_object(self):
        auction = get_object_or_404(Auction, id=self.kwargs['pk'], owner=self.request.user)
        return auction

class AuctionDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuctionSerializer
    queryset = Auction.objects.all()

    def get_object(self):
        auction = get_object_or_404(Auction, id=self.kwargs['pk'], owner=self.request.user)
        return auction

# -------------------
# Bids
# -------------------
class BidCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BidSerializer

    def create(self, request, *args, **kwargs):
        auction_item_id = self.kwargs['auction_item_id']
        auction_item = get_object_or_404(AuctionItem, id=auction_item_id)

        amount = int(request.data.get('amount', 0))
        user = request.user

        if amount <= 0:
            return Response({"error": "Invalid amount"}, status=400)

        if user.token_balance < amount:
            return Response({"error":"No tienes suficientes tokens"}, status=400)

        highest_bid = auction_item.bids.first()
        if highest_bid and amount <= highest_bid.amount:
            return Response({"error":"La puja debe ser mayor a la actual"}, status=400)

        bid = Bid.objects.create(auction_item=auction_item, user=user, amount=amount)
        
        user.token_balance -= amount
        user.save()

        return Response(self.get_serializer(bid).data, status=201)


class BidListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = BidSerializer

    def get_queryset(self):
        auction_item_id = self.kwargs['auction_item_id']
        return Bid.objects.filter(auction_item_id=auction_item_id).order_by('-amount', 'created_at')

# -------------------
# Items Granted
# -------------------

class ItemGrantedListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemGrantedSerializer

    def get_queryset(self):
        return ItemGranted.objects.filter(winner=self.request.user)



class WebRTCICEServersView(APIView):
    """
    Devuelve la lista de ICE servers (STUN/TURN) para WebRTC.
    """
    permission_classes = [IsAuthenticated]  # solo usuarios autenticados

    def get(self, request, format=None):
        ice_servers = [
            {"urls": "stun:stun.l.google.com:19302"}
        ]
        return Response({"iceServers": ice_servers})
    
