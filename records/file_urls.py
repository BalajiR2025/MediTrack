from rest_framework.routers import DefaultRouter

from .views import RecordFileViewSet

router = DefaultRouter()
router.register(r"", RecordFileViewSet, basename="files")

urlpatterns = router.urls
