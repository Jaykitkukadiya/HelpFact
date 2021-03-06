# Generated by Django 3.1.4 on 2021-05-27 05:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0048_auto_20210522_1253'),
    ]

    operations = [
        migrations.CreateModel(
            name='message_user_state',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=400)),
                ('state', models.CharField(choices=[('user', 'user'), ('agent', 'agent')], default='user', max_length=6)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
