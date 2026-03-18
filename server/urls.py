"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import analytics

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth endpoints (for frontend and external clients)
    path('api/auth/', include('accounts.urls')),
    # Legacy/internal auth endpoints
    path('api/accounts/', include('accounts.urls')),

    path('api/patient/', include('patient.urls')),
    path('api/doctor/', include('doctor.urls')),
    path('api/', include('patient.urls_v2')),
    path('api/records/', include('records.urls')),
    path('api/files/', include('records.file_urls')),
    path('api/hospitals/', include('hospitals.urls')),
    path('api/', include('audit.urls')),

    # Analytics endpoints
    path('api/analytics/dashboard', analytics.dashboard_stats),
    path('api/analytics/records', analytics.record_stats),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
