# Generated by Django 3.1.4 on 2021-05-10 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0041_completed_task_task_expire_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='completed_task',
            name='task_expire_id',
        ),
        migrations.AddField(
            model_name='panding_task',
            name='task_expire_id',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
