from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from patient.models import PatientProfile, MedicalRecord
from patient.serializers import PatientProfileSerializer, MedicalRecordSerializer


class DoctorPatientDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):

        try:
            # Get patient profile
            profile = PatientProfile.objects.get(id=patient_id)
            profile_data = PatientProfileSerializer(profile).data

            # Get medical records
            records = MedicalRecord.objects.filter(patient=profile)
            records_data = MedicalRecordSerializer(records, many=True).data

            return Response({
                "patient_profile": profile_data,
                "medical_records": records_data
            })

        except PatientProfile.DoesNotExist:
            return Response({
                "error": "Patient not found"
            }, status=404)