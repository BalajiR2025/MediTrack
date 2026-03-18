from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PatientProfile, MedicalRecord
from .serializers import PatientProfileSerializer, MedicalRecordSerializer
from accounts.permissions import IsPatient

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        profile = PatientProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"message": "Profile not created yet"}, status=404)
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        if hasattr(request.user, "profile") and not request.user.profile.email_verified:
            return Response({"error": "Email not verified"}, status=403)
        serializer = PatientProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class MedicalRecordView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        records = MedicalRecord.objects.filter(patient__user=request.user)
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            profile = PatientProfile.objects.filter(user=request.user).first()
            if not profile:
                return Response({"error": "Patient profile not created yet"}, status=400)
            serializer.save(patient=profile)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
