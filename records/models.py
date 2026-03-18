from django.db import models

class RecordStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"


class MedicalRecord(models.Model):
    patient = models.ForeignKey("patient.Patient", on_delete=models.CASCADE, related_name="records")
    hospital = models.ForeignKey("hospitals.Hospital", null=True, blank=True, on_delete=models.SET_NULL)

    created_by = models.ForeignKey(
        "auth.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="created_records"
    )
    doctor = models.ForeignKey(
        "auth.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="doctor_records"
    )

    status = models.CharField(max_length=20, choices=RecordStatus.choices, default=RecordStatus.PENDING)
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.TextField(blank=True, default="")

    symptoms = models.TextField(blank=True, default="")
    diagnosis = models.TextField(blank=True, default="")
    medicines = models.TextField(blank=True, default="")
    notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)


def record_upload_path(instance, filename):
    return f"records/{instance.record_id}/{filename}"


class RecordFile(models.Model):
    record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to=record_upload_path)
    uploaded_by = models.ForeignKey("auth.User", null=True, blank=True, on_delete=models.SET_NULL)
    uploaded_at = models.DateTimeField(auto_now_add=True)
