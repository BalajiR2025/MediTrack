from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    patient_code = serializers.CharField(read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "patient_code",
            "name",
            "age",
            "gender",
            "blood_group",
            "phone",
            "address",
            "hospital",
            "created_at",
        ]
        read_only_fields = ["id", "patient_code", "created_at"]

