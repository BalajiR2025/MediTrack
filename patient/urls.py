from django.urls import path
from .views import PatientProfileView, MedicalRecordView

urlpatterns = [
    path("profile/", PatientProfileView.as_view()),
    path("records/", MedicalRecordView.as_view()),
]
