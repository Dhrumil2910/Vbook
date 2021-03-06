# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-14 20:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vbook', '0004_url_notebook'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='url',
            name='notebook',
        ),
        migrations.AddField(
            model_name='url',
            name='color',
            field=models.CharField(choices=[(b'blue', b'Blue'), (b'red', b'Red'), (b'green', b'Green'), (b'yellow', b'Yellow')], default=b'blue', max_length=10),
        ),
        migrations.AddField(
            model_name='url',
            name='is_favorite',
            field=models.BooleanField(default=False),
        ),
        migrations.RemoveField(
            model_name='url',
            name='tag',
        ),
        migrations.AddField(
            model_name='url',
            name='tag',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='vbook.Tag'),
            preserve_default=False,
        ),
    ]
