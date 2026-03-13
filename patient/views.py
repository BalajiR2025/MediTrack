from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PatientProfile, MedicalRecord
from .serializers import PatientProfileSerializer, MedicalRecordSerializer

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = PatientProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({"message": "Profile not created yet"}, status=404)
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class MedicalRecordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = MedicalRecord.objects.filter(patient__user=request.user)
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
