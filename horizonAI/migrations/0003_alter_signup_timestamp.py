# Generated by Django 4.1.7 on 2023-08-07 10:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horizonAI', '0002_user_phone_number_alter_signup_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 7, 12, 5, 34, 277154)),
        ),
    ]