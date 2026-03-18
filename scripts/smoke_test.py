"""Quick smoke test for API endpoints.

Run with: python scripts/smoke_test.py
"""

import os
import sys

# Ensure project root is on PYTHONPATH
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

import django

django.setup()

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


def main():
    user, _ = User.objects.get_or_create(username="smoke_admin", defaults={"email": "smoke@example.com"})
    user.set_password("smokepass")
    user.is_superuser = True
    user.is_staff = True
    user.save()

    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    resp = client.post("/api/hospitals/", {"name": "Smoke Hospital", "address": "Smoke"}, format="json")
    if resp.status_code == 201:
        hospital_id = resp.data.get("id")
    else:
        # Use existing hospital if already created
        from hospitals.models import Hospital

        hospital = Hospital.objects.filter(name="Smoke Hospital").first()
        hospital_id = hospital.id if hospital else None
    print("hospital create", resp.status_code, resp.data, "using hospital_id", hospital_id)
    if not hospital_id:
        return

    # Ensure we have a doctor user for approve/reject/flag actions
    doctor, _ = User.objects.get_or_create(username="smoke_doctor", defaults={"email": "doctor@example.com"})
    doctor.set_password("smokepass")
    doctor.save()
    doctor.profile.role = "doctor"
    doctor.profile.email_verified = True
    doctor.profile.save()

    doctor_client = APIClient()
    doctor_refresh = RefreshToken.for_user(doctor)
    doctor_client.credentials(HTTP_AUTHORIZATION=f"Bearer {doctor_refresh.access_token}")

    resp = client.post(
        "/api/patients/",
        {"name": "John Smoke", "age": 30, "gender": "male", "blood_group": "O+", "phone": "123", "hospital": hospital_id},
        format="json",
    )
    print("patient create", resp.status_code, resp.data)
    if resp.status_code != 201:
        return

    patient_id = resp.data.get("id")

    resp = client.post(
        "/api/records/",
        {"patient_id": patient_id, "symptoms": "cough", "diagnosis": "cold", "medicines": "rest", "notes": "smoke test"},
        format="json",
    )
    print("record create", resp.status_code, resp.data)
    record_id = resp.data.get("id")

    if record_id:
        # Upload a sample PDF file to the record
        import io

        fake_file = io.BytesIO(b"%PDF-1.4\n%Fake PDF content")
        fake_file.name = "test.pdf"
        resp = doctor_client.post(f"/api/records/{record_id}/upload/", {"file": fake_file}, format="multipart")
        print("record file upload", resp.status_code, resp.data)

        resp = doctor_client.patch(f"/api/records/{record_id}/approve/", format="json")
        print("record approve", resp.status_code, resp.data)

        resp = doctor_client.patch(f"/api/records/{record_id}/flag/", {"reason": "test"}, format="json")
        print("record flag", resp.status_code, resp.data)

        resp = doctor_client.patch(f"/api/records/{record_id}/reject/", format="json")
        print("record reject", resp.status_code, resp.data)


if __name__ == "__main__":
    main()
