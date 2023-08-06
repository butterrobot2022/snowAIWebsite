from django.contrib import admin
from .models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(SignUp)
admin.site.register(User, UserAdmin)
admin.site.register(Journal)
admin.site.register(Account)
admin.site.register(NewTrade)
admin.site.register(Transaction)


