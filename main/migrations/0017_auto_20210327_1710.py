# Generated by Django 3.1.4 on 2021-03-27 11:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_exntend_user_details_channel_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exntend_user_details',
            old_name='channel_name',
            new_name='user_channel_name',
        ),
    ]
