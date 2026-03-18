from rest_framework.routers import DefaultRouter
from .views_v2 import PatientViewSet

router = DefaultRouter()
router.register(r"patients", PatientViewSet, basename="patients")

urlpatterns = router.urls

