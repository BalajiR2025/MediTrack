from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    RequestEmailOTPView,
    VerifyEmailOTPView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('profile/', ProfileView.as_view()),
    # Frontend expects /auth/me for current user
    path('me/', ProfileView.as_view()),
    path('request-otp/', RequestEmailOTPView.as_view()),
    path('verify-otp/', VerifyEmailOTPView.as_view()),
]
