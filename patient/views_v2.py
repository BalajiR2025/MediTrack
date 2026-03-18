from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import IsAdmin, IsDoctor, IsStaff, IsPatient
from .models import Patient
from .serializers_v2 import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    Spec endpoints:
    - POST /patients/ (admin/doctor/staff)
    - GET /patients/{id} (admin/doctor/staff OR patient self)
    - GET /patients/ with filters

    Notes:
    - Patients (role=patient) can only see their own Patient record (linked via Patient.user).
    """

    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["hospital", "gender", "blood_group"]
    search_fields = ["name", "phone"]
    ordering_fields = ["created_at", "name"]

    def get_queryset(self):
        user = self.request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role == "patient":
            return Patient.objects.filter(user=user)
        return super().get_queryset()

    def perform_create(self, serializer):
        user = self.request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role not in ("admin", "doctor", "staff") and not user.is_superuser:
            raise PermissionDenied("Not allowed")
        serializer.save()

