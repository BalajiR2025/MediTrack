from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MediTrackTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = getattr(user, "profile", None)
        if profile:
            token["role"] = profile.role
            token["hospital_id"] = profile.hospital_id
        token["email"] = user.email
        return token

