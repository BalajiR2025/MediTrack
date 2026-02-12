from django.db import models
from django.contrib.auth.models import User

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
