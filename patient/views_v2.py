from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied

from accounts.permissions import IsAdmin, IsDoctor, IsStaff, IsPatient
from .models import Patient
from .serializers_v2 import PatientSerializer
from records.serializers import MedicalRecordSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    Spec endpoints:
    - POST /patients/ (admin/doctor/staff)
    - GET /patients/{id} (admin/doctor/staff OR patient self)
    - GET /patients/ with filters
    - GET /patients/by-code/?code=<code> (any authenticated user)

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

    @action(detail=True, methods=["get"])
    def records(self, request, pk=None):
        """Get medical records for a patient."""
        patient = self.get_object()
        records = patient.records.all()
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="by-code")
    def by_code(self, request):
        code = request.query_params.get("code")
        if not code:
            return Response({"detail": "code query parameter is required."}, status=400)

        patient = Patient.objects.filter(patient_code=code).first()
        if not patient:
            return Response({"detail": "Patient not found."}, status=404)

        # Ensure patient can access their own record if they are a patient
        user = request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role == "patient" and patient.user != user:
            return Response({"detail": "Not allowed."}, status=403)

        serializer = self.get_serializer(patient)
        return Response(serializer.data)

