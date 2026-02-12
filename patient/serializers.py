from rest_framework import serializers
from .models import PatientProfile, MedicalRecord

class PatientProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = PatientProfile
        fields = ["user", "age", "gender", "blood_group", "phone"]


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = "__all__"
