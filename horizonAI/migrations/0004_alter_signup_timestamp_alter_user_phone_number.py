# Generated by Django 4.1.7 on 2023-08-07 11:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horizonAI', '0003_alter_signup_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 7, 13, 49, 56, 345568)),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
