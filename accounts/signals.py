from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile, UserRole


@receiver(post_save, sender=User)
def ensure_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, role=UserRole.PATIENT, email_verified=False)
    else:
        # If some legacy users exist without profile, repair
        UserProfile.objects.get_or_create(
            user=instance, defaults={"role": UserRole.PATIENT, "email_verified": False}
        )

