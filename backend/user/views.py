# yourapp/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from .serializers import RegisterSerializer, UserSerializer  
from .serializers import UserSerializer
from firebase_admin import auth as firebase_auth

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user).data,
            "message": "Registration successful"
        }, status=201)


# Inicializa Firebase Admin (hazlo una vez, por ejemplo en settings.py)
# firebase_admin.initialize_app(...)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        if getattr(user, "is_banned", False):
            return JsonResponse({"error": "User is banned"}, status=403)

        # 1️⃣ JWT Django
        access = AccessToken.for_user(user)

        # 2️⃣ Firebase Custom Token
        firebase_token = firebase_auth.create_custom_token(str(user.id)).decode()

        response = JsonResponse({
            "user": UserSerializer(user).data,
            "message": "Login successful"
        })

        # Cookie JWT Django
        response.set_cookie(
            key="access_token",
            value=str(access),
            httponly=True,
            secure=False,      # True en producción HTTPS
            samesite="None",   # o "Lax"/"Strict" según front y back
            max_age=60 * 60,   # coincidir con ACCESS_TOKEN_LIFETIME
            path="/"
        )

        # Cookie Firebase Custom Token
        response.set_cookie(
            key="firebase_token",
            value=firebase_token,
            httponly=True,
            secure=False,      # True en producción HTTPS
            samesite="None",
            max_age=60 * 60,
            path="/"
        )

        return response



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = JsonResponse({"message": "Logged out"})
        response.delete_cookie("access_token")
        return response
