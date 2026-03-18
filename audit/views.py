from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdmin
from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().select_related("user", "record", "patient")
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.query_params.get("user")
        action = self.request.query_params.get("action")
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        record_id = self.request.query_params.get("record_id")
        patient_id = self.request.query_params.get("patient_id")

        if user:
            queryset = queryset.filter(user__username__icontains=user)
        if action:
            queryset = queryset.filter(action__icontains=action)
        if record_id:
            queryset = queryset.filter(record__id=record_id)
        if patient_id:
            queryset = queryset.filter(patient__id=patient_id)
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to)

        return queryset
