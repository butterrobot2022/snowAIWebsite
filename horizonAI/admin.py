from django.contrib import admin
from .models import SignUp, User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(SignUp)


admin.site.register(User, UserAdmin)