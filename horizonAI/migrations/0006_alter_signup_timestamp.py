# Generated by Django 4.1.7 on 2023-08-07 11:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horizonAI', '0005_alter_signup_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 7, 13, 57, 4, 641662)),
        ),
    ]