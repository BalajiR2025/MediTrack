import os

from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsDoctor, IsStaff
from audit.models import AuditLog
from patient.models import Patient
from .models import MedicalRecord, RecordFile, RecordStatus
from .serializers import MedicalRecordSerializer, RecordFileSerializer


def _get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _log_action(request, action, record=None, patient=None, meta=None):
    AuditLog.objects.create(
        user=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
        action=action,
        record=record,
        patient=patient,
        meta=meta or {},
        ip_address=_get_client_ip(request),
    )


class MedicalRecordViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Manage medical records.

    Endpoints:
      - POST /records/ (staff/doctor/admin)
      - GET /records/ (role-based)
      - GET /records/{id}/
      - PATCH /records/{id}/approve
      - PATCH /records/{id}/reject
      - PATCH /records/{id}/flag
      - POST /records/{id}/upload
      - DELETE /records/{id}/ (admin only)
    """

    queryset = MedicalRecord.objects.all().select_related("patient", "hospital", "doctor", "created_by")
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(getattr(user, "profile", None), "role", None)

        if role == "patient":
            patient = Patient.objects.filter(user=user).first()
            if not patient:
                return MedicalRecord.objects.none()
            return MedicalRecord.objects.filter(patient=patient)

        # Doctor / staff / admin see all records (could be filtered by hospital in the future)
        return super().get_queryset()

    def perform_create(self, serializer):
        user = self.request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role not in ("admin", "doctor", "staff") and not user.is_superuser:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Not allowed")

        patient_id = serializer.validated_data.get("patient_id")
        patient = get_object_or_404(Patient, id=patient_id)

        record_kwargs = {
            "patient": patient,
            "hospital": patient.hospital,
            "created_by": user,
        }

        now = timezone.now()
        if role == "doctor":
            record_kwargs["doctor"] = user
            record_kwargs["status"] = RecordStatus.APPROVED
            record_kwargs["approved_at"] = now
        else:
            # staff / admin - record starts pending.
            record_kwargs["status"] = RecordStatus.PENDING

        record = serializer.save(**record_kwargs)
        _log_action(request=self.request, action="record.created", record=record, patient=patient, meta={"created_by_role": role})

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsDoctor])
    def approve(self, request, pk=None):
        record = self.get_object()
        if record.status != RecordStatus.PENDING:
            return Response({"detail": "Only pending records can be approved."}, status=status.HTTP_400_BAD_REQUEST)
        record.status = RecordStatus.APPROVED
        record.doctor = request.user
        record.approved_at = timezone.now()
        record.save(update_fields=["status", "doctor", "approved_at"])
        _log_action(request, "record.approved", record=record, patient=record.patient)
        return Response(self.get_serializer(record).data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsDoctor])
    def reject(self, request, pk=None):
        record = self.get_object()
        if record.status != RecordStatus.PENDING:
            return Response({"detail": "Only pending records can be rejected."}, status=status.HTTP_400_BAD_REQUEST)
        record.status = RecordStatus.REJECTED
        record.rejected_at = timezone.now()
        record.save(update_fields=["status", "rejected_at"])
        _log_action(request, "record.rejected", record=record, patient=record.patient)
        return Response(self.get_serializer(record).data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsDoctor])
    def flag(self, request, pk=None):
        record = self.get_object()
        reason = request.data.get("reason", "")
        if not reason:
            return Response({"detail": "Flag reason is required."}, status=status.HTTP_400_BAD_REQUEST)
        record.is_flagged = True
        record.flag_reason = reason
        record.save(update_fields=["is_flagged", "flag_reason"])
        _log_action(request, "record.flagged", record=record, patient=record.patient, meta={"reason": reason})
        return Response(self.get_serializer(record).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def upload(self, request, pk=None):
        record = self.get_object()
        user = request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role not in ("doctor", "staff", "admin") and not user.is_superuser:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        upload_file = request.FILES.get("file")
        if not upload_file:
            return Response({"detail": "file is required"}, status=status.HTTP_400_BAD_REQUEST)

        # validate file type
        allowed_ext = [".pdf", ".png", ".jpg", ".jpeg"]
        _, ext = os.path.splitext(upload_file.name or "")
        if ext.lower() not in allowed_ext:
            return Response({"detail": "Only PDF/PNG/JPG files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        record_file = RecordFile.objects.create(record=record, file=upload_file, uploaded_by=user)
        _log_action(request, "record.file_uploaded", record=record, patient=record.patient, meta={"file_id": record_file.id})
        serializer = RecordFileSerializer(record_file, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role != "admin" and not user.is_superuser:
            return Response({"detail": "Only admins can delete records."}, status=status.HTTP_403_FORBIDDEN)

        record = self.get_object()
        _log_action(request, "record.deleted", record=record, patient=record.patient)
        return super().destroy(request, *args, **kwargs)


class RecordFileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RecordFile.objects.all().select_related("record", "uploaded_by")
    serializer_class = RecordFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = getattr(getattr(user, "profile", None), "role", None)
        if role == "patient":
            patient = Patient.objects.filter(user=user).first()
            if not patient:
                return RecordFile.objects.none()
            return RecordFile.objects.filter(record__patient=patient)
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        file_field = instance.file
        if not file_field:
            raise Http404("File not found")
        response = FileResponse(file_field.open("rb"), as_attachment=True, filename=os.path.basename(file_field.name))
        return response
