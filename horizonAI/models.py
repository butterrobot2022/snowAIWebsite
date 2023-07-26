# from django.contrib.auth.models import User
from django.db import models
import datetime
# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class SignUp(models.Model):
    email = models.EmailField(unique=True)
    timestamp = models.DateTimeField(default=datetime.datetime.now())


    def __str__(self):
        return f'New SignUp email is {self.email}'

