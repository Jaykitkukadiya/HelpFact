# Generated by Django 3.1.4 on 2021-05-10 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0038_auto_20210510_1847'),
    ]

    operations = [
        migrations.AlterField(
            model_name='completed_task',
            name='accepted',
            field=models.CharField(choices=[('initilize', 'initilize'), ('accepted', 'accepted')], default='initilize', max_length=10),
        ),
        migrations.AlterField(
            model_name='completed_task',
            name='refund_status',
            field=models.CharField(choices=[('-', '-'), ('panding', 'panding'), ('success', 'success')], default='-', max_length=8),
        ),
    ]
