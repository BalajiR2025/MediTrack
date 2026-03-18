from rest_framework import serializers

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    record_id = serializers.IntegerField(source="record.id", read_only=True)
    patient_id = serializers.UUIDField(source="patient.id", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user",
            "action",
            "record_id",
            "patient_id",
            "meta",
            "ip_address",
            "created_at",
        ]
        read_only_fields = fields
