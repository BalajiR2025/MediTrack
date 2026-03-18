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
from patient.models import Patient
from hospitals.models import Hospital
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
            return Response({"message": "Missing fields"}, status=400)

        if not re.match(r"[^@]+@[^@]+\.[^@]+", str(email)):
            return Response({"message": "Invalid email"}, status=400)

        if role not in (UserRole.PATIENT, UserRole.DOCTOR, UserRole.STAFF, UserRole.ADMIN):
            return Response({"message": "Invalid role"}, status=400)

        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response({"message": "User already exists"}, status=400)

        # Create user and populate name fields if provided
        name = request.data.get("name")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        username = email

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        if name:
            parts = name.strip().split(" ", 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""
        else:
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
        user.save()

        # ensure role is set (signal creates profile)
        if hasattr(user, "profile"):
            profile = user.profile
            profile.role = role
            profile.email_verified = False

            # Common profile fields
            profile.phone = request.data.get("phone", profile.phone)
            profile.address = request.data.get("address", profile.address)

            # Hospital association (if provided)
            hospital_id = request.data.get("hospitalId") or request.data.get("hospital_id")
            if hospital_id:
                try:
                    profile.hospital = Hospital.objects.get(id=hospital_id)
                except Hospital.DoesNotExist:
                    pass

            # Patient-specific fields
            if role == UserRole.PATIENT:
                try:
                    profile.age = int(request.data.get("age", profile.age or 0))
                except (TypeError, ValueError):
                    pass
                profile.gender = request.data.get("gender", profile.gender)
                profile.blood_group = request.data.get("blood_group", profile.blood_group)

            # Doctor-specific fields
            if role == UserRole.DOCTOR:
                profile.license_id = request.data.get("license_id", profile.license_id)
                profile.specialization = request.data.get("specialization", profile.specialization)
                try:
                    profile.experience_years = int(request.data.get("experience_years", profile.experience_years or 0))
                except (TypeError, ValueError):
                    pass

            # Staff-specific fields
            if role == UserRole.STAFF:
                profile.position = request.data.get("position", profile.position)

            profile.save()

            # If patient, create a Patient record to tie to this user
            if role == UserRole.PATIENT:
                try:
                    age = int(request.data.get("age", 0))
                except (TypeError, ValueError):
                    age = 0
                Patient.objects.create(
                    user=user,
                    name=f"{user.first_name or ''} {user.last_name or ''}".strip() or email,
                    age=age or 0,
                    gender=request.data.get("gender", ""),
                    blood_group=request.data.get("blood_group", ""),
                    phone=request.data.get("phone", ""),
                    address=request.data.get("address", ""),
                    hospital=profile.hospital,
                )

        refresh = RefreshToken.for_user(user)

        otp = f"{random.randint(0, 999999):06d}"
        EmailOTP.objects.create(email=email, otp=otp)

        user_data = {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": role,
            "phone": getattr(user.profile, "phone", "") if hasattr(user, "profile") else "",
            "address": getattr(user.profile, "address", "") if hasattr(user, "profile") else "",
        }
        if hasattr(user, "profile") and getattr(user.profile, "hospital", None):
            user_data["hospitalId"] = user.profile.hospital.id
            user_data["hospitalName"] = user.profile.hospital.name

        return Response(
            {
                "message": "User registered successfully. Verify email to continue.",
                "token": str(refresh.access_token),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data,
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

        user_data = {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": role,
        }
        if hasattr(user, "profile") and getattr(user.profile, "hospital", None):
            user_data["hospitalId"] = user.profile.hospital.id
            user_data["hospitalName"] = user.profile.hospital.name

        return Response(
            {
                "message": "Login successful",
                "token": str(refresh.access_token),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data,
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
        role = getattr(getattr(request.user, "profile", None), "role", UserRole.PATIENT)
        user_data = {
            "id": request.user.id,
            "name": request.user.get_full_name() or request.user.username,
            "email": request.user.email,
            "role": role,
        }

        profile = getattr(request.user, "profile", None)
        if profile and getattr(profile, "hospital", None):
            user_data["hospitalId"] = profile.hospital.id
            user_data["hospitalName"] = profile.hospital.name

        return Response(user_data)
