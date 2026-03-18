from django.db import models

class AuditLog(models.Model):
    user = models.ForeignKey("auth.User", null=True, blank=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=100)
    record = models.ForeignKey("records.MedicalRecord", null=True, blank=True, on_delete=models.SET_NULL)
    patient = models.ForeignKey("patient.Patient", null=True, blank=True, on_delete=models.SET_NULL)
    meta = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
