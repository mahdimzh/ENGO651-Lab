from core.user.models import User


data_user = {
    "email": "ma.mohammdadizadeh@gmail.co",
    "password": "12345678",
    "username": "testuser"
}

User.objects.create_user(**data_user)
