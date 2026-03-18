from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsDoctor, IsStaff
from accounts.models import UserProfile, UserRole
from patient.models import Patient
from records.models import MedicalRecord, RecordStatus
from hospitals.models import Hospital


def _user_can_access_analytics(user):
    role = getattr(getattr(user, "profile", None), "role", None)
    return role in ("admin", "doctor", "staff") or user.is_superuser


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not _user_can_access_analytics(request.user):
        return Response({"detail": "Permission denied."}, status=403)

    total_patients = Patient.objects.count()
    total_records = MedicalRecord.objects.count()
    pending_approvals = MedicalRecord.objects.filter(status=RecordStatus.PENDING).count()
    total_hospitals = Hospital.objects.count()

    # Count active doctors (by user profile role)
    total_doctors = UserProfile.objects.filter(role=UserRole.DOCTOR).count()

    # Monthly activity (last 6 months)
    monthly = (
        MedicalRecord.objects
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(records=Count("id"), patients=Count("patient", distinct=True))
        .order_by("month")
    )

    monthly_activity = [
        {
            "month": entry["month"].strftime("%Y-%m"),
            "records": entry["records"],
            "patients": entry["patients"],
        }
        for entry in monthly
    ]

    records_by_status = (
        MedicalRecord.objects.values("status").annotate(count=Count("id"))
    )

    patients_per_hospital = (
        Patient.objects.values("hospital__name")
        .annotate(patients=Count("id"))
        .order_by("hospital__name")
    )

    return Response(
        {
            "totalPatients": total_patients,
            "totalDoctors": total_doctors,
            "totalRecords": total_records,
            "pendingApprovals": pending_approvals,
            "totalHospitals": total_hospitals,
            "monthlyActivity": monthly_activity,
            "recordsByStatus": list(records_by_status),
            "patientsPerHospital": [
                {"hospital": entry["hospital__name"], "patients": entry["patients"]}
                for entry in patients_per_hospital
            ],
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def record_stats(request):
    if not _user_can_access_analytics(request.user):
        return Response({"detail": "Permission denied."}, status=403)

    total = MedicalRecord.objects.count()
    approved = MedicalRecord.objects.filter(status=RecordStatus.APPROVED).count()
    pending = MedicalRecord.objects.filter(status=RecordStatus.PENDING).count()
    rejected = MedicalRecord.objects.filter(status=RecordStatus.REJECTED).count()
    flagged = MedicalRecord.objects.filter(is_flagged=True).count()

    by_type = (
        MedicalRecord.objects.values("status").annotate(count=Count("id"))
    )

    return Response(
        {
            "total": total,
            "approved": approved,
            "pending": pending,
            "rejected": rejected,
            "flagged": flagged,
            "byType": list(by_type),
        }
    )
