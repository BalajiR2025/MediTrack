from django.urls import path
from .views import DoctorPatientDetails

urlpatterns = [
    path("patient/<int:patient_id>/", DoctorPatientDetails.as_view()),
]