from django.db import models
from django.contrib.auth.models import User


class UserRole(models.TextChoices):
    PATIENT = "patient", "Patient"
    DOCTOR = "doctor", "Doctor"
    STAFF = "staff", "Staff"
    ADMIN = "admin", "Admin"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)
    email_verified = models.BooleanField(default=False)
    hospital = models.ForeignKey("hospitals.Hospital", null=True, blank=True, on_delete=models.SET_NULL)

    # Common user profile fields
    phone = models.CharField(max_length=30, blank=True, default="")
    address = models.TextField(blank=True, default="")
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)

    # Patient-specific fields
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True, default="")
    blood_group = models.CharField(max_length=10, blank=True, default="")

    # Doctor-specific fields
    license_id = models.CharField(max_length=100, blank=True, default="")
    specialization = models.CharField(max_length=100, blank=True, default="")
    experience_years = models.IntegerField(null=True, blank=True)

    # Staff-specific fields
    position = models.CharField(max_length=100, blank=True, default="")

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class EmailOTP(models.Model):
    """
    Dev-friendly email verification.
    In production you'd email the OTP; here we return it in the API response.
    """

    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
