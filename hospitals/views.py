from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsDoctor, IsStaff
from patient.models import Patient
from records.models import MedicalRecord
from .models import Hospital
from .serializers import HospitalSerializer


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Only authenticated users can access hospitals.
        # Admin/doctor/staff can create and list. Patients can view their own hospital via patient endpoints.
        return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        role = getattr(getattr(request.user, "profile", None), "role", None)
        if role not in ("admin", "doctor", "staff") and not request.user.is_superuser:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Not allowed")
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def analytics(self, request, pk=None):
        hospital = self.get_object()

        patient_count = Patient.objects.filter(hospital=hospital).count()
        record_qs = MedicalRecord.objects.filter(hospital=hospital)
        record_count = record_qs.count()

        records_per_doctor = (
            record_qs
            .filter(doctor__isnull=False)
            .values("doctor__username")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        daily_activity = (
            record_qs
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("-day")[:14]
        )

        return Response(
            {
                "hospital_id": hospital.id,
                "hospital_name": hospital.name,
                "patient_count": patient_count,
                "record_count": record_count,
                "records_per_doctor": list(records_per_doctor),
                "daily_activity": list(daily_activity),
            }
        )
