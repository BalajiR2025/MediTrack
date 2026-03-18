from rest_framework import serializers

from patient.models import Patient
from .models import MedicalRecord, RecordFile


class RecordFileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.CharField(source="uploaded_by.username", read_only=True)

    class Meta:
        model = RecordFile
        fields = ["id", "file", "uploaded_by", "uploaded_at"]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]


class MedicalRecordSerializer(serializers.ModelSerializer):
    files = RecordFileSerializer(many=True, read_only=True)
    patient_id = serializers.UUIDField(write_only=True, required=True)

    class Meta:
        model = MedicalRecord
        fields = [
            "id",
            "patient_id",
            "patient",
            "hospital",
            "created_by",
            "doctor",
            "status",
            "is_flagged",
            "flag_reason",
            "symptoms",
            "diagnosis",
            "medicines",
            "notes",
            "created_at",
            "approved_at",
            "rejected_at",
            "files",
        ]
        read_only_fields = [
            "id",
            "patient",
            "hospital",
            "created_by",
            "doctor",
            "status",
            "is_flagged",
            "flag_reason",
            "created_at",
            "approved_at",
            "rejected_at",
            "files",
        ]

    def validate_patient_id(self, value):
        if not Patient.objects.filter(id=value).exists():
            raise serializers.ValidationError("Patient not found")
        return value
