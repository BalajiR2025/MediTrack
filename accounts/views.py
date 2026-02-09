from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    authentication_classes = [BasicAuthentication]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=400)

        User.objects.create_user(username=username, password=password)
        return Response({"message": "User registered successfully"})


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    authentication_classes = [BasicAuthentication]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({"message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    authentication_classes = [BasicAuthentication]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})


@method_decorator(csrf_exempt, name='dispatch')
class ProfileView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "message": "You are authenticated"
        })
