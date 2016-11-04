# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-14 20:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vbook', '0003_auto_20161014_2023'),
    ]

    operations = [
        migrations.AddField(
            model_name='url',
            name='notebook',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='vbook.Notebook'),
            preserve_default=False,
        ),
    ]
