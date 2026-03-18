from rest_framework.routers import DefaultRouter
from .views import HospitalViewSet

router = DefaultRouter()
router.register(r"", HospitalViewSet, basename="hospitals")

urlpatterns = router.urls
