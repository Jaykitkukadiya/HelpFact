# Generated by Django 3.1.4 on 2021-03-28 18:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0025_auto_20210328_1306'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='online',
            name='socket_name',
        ),
    ]
