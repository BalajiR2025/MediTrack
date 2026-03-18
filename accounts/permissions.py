from rest_framework.permissions import BasePermission


def _role(user):
    profile = getattr(user, "profile", None)
    return getattr(profile, "role", None)


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return bool(user.is_superuser or _role(user) == "admin")


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return bool(_role(user) == "doctor")


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return bool(_role(user) == "patient")


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        return bool(_role(user) == "staff")

