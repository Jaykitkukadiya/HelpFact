# Generated by Django 3.1.4 on 2021-03-27 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_exntend_user_details_user_channel_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exntend_user_details',
            name='user_channel_name',
        ),
        migrations.AddField(
            model_name='online',
            name='state',
            field=models.CharField(choices=[('user', 'user'), ('agent', 'agent')], default='user', max_length=6),
        ),
    ]
