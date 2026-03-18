from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import UserRole
from .models import EmailOTP
import random
import re


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role") or UserRole.PATIENT

        if not email or not password:
            return Response({"error": "Missing fields"}, status=400)

        if not re.match(r"[^@]+@[^@]+\.[^@]+", str(email)):
            return Response({"error": "Invalid email"}, status=400)

        if role not in (UserRole.PATIENT, UserRole.DOCTOR, UserRole.STAFF, UserRole.ADMIN):
            return Response({"error": "Invalid role"}, status=400)

        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        # ensure role is set (signal creates profile)
        if hasattr(user, "profile"):
            user.profile.role = role
            user.profile.email_verified = False
            user.profile.save()
        refresh = RefreshToken.for_user(user)

        otp = f"{random.randint(0, 999999):06d}"
        EmailOTP.objects.create(email=email, otp=otp)

        return Response(
            {
                "message": "User registered successfully. Verify email to continue.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {"username": user.username, "email": email},
                "role": role,
                "dev_otp": otp,
            },
            status=201,
        )


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]   # 🔥 THIS LINE FIXES IT

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")

        try:
            user = User.objects.get(username=email)
        except User.DoesNotExist:
            user = None
        if user is None or not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=401)

        if hasattr(user, "profile") and not user.profile.email_verified:
            return Response({"error": "Email not verified"}, status=403)

        refresh = RefreshToken.for_user(user)
        role = getattr(getattr(user, "profile", None), "role", UserRole.PATIENT)
        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {"username": user.username, "email": user.email},
                "role": role,
            },
            status=200,
        )


@method_decorator(csrf_exempt, name='dispatch')
class RequestEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Missing email"}, status=400)
        otp = f"{random.randint(0, 999999):06d}"
        EmailOTP.objects.create(email=email, otp=otp)
        return Response({"message": "OTP generated", "dev_otp": otp}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class VerifyEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        if not email or not otp:
            return Response({"error": "Missing fields"}, status=400)

        rec = EmailOTP.objects.filter(email=email, otp=otp, is_used=False).order_by("-created_at").first()
        if not rec:
            return Response({"error": "Invalid OTP"}, status=400)
        rec.is_used = True
        rec.save()

        user = User.objects.filter(email=email).first()
        if user and hasattr(user, "profile"):
            user.profile.email_verified = True
            user.profile.save()

        return Response({"message": "Email verified"}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Blacklist refresh token if provided
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        logout(request)
        return Response({"message": "Logged out successfully"}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "role": getattr(getattr(request.user, "profile", None), "role", UserRole.PATIENT),
            "email_verified": getattr(getattr(request.user, "profile", None), "email_verified", False),
            "message": "You are authenticated",
        })
