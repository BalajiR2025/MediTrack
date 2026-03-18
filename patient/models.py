from django.db import models
from django.contrib.auth.models import User
import uuid
import random
import string


def generate_patient_code():
    """Generate a unique 10-digit patient code."""
    while True:
        code = ''.join(random.choices(string.digits, k=10))
        if not Patient.objects.filter(patient_code=code).exists():
            return code


class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_code = models.CharField(max_length=10, unique=True, default=generate_patient_code)
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    blood_group = models.CharField(max_length=10, blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    address = models.TextField(blank=True, default="")
    hospital = models.ForeignKey("hospitals.Hospital", null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.patient_code})"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username


class MedicalRecord(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    medicines = models.TextField()
    doctor_name = models.CharField(max_length=100)
    visit_date = models.DateField()

    def __str__(self):
        return f"{self.patient.user.username} - {self.visit_date}"
