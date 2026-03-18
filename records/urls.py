from rest_framework.routers import DefaultRouter
from .views import MedicalRecordViewSet, RecordFileViewSet

router = DefaultRouter()
router.register(r"", MedicalRecordViewSet, basename="records")
router.register(r"files", RecordFileViewSet, basename="files")

urlpatterns = router.urls
