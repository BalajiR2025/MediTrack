from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
