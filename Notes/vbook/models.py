from django.db import models
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User

# Create your models here.

COLOR_CHOICES = (
        ('blue', 'Blue'),
        ('red', 'Red'),
        ('green', 'Green'),
        ('yellow', 'Yellow')
    )

# class User(models.Model):
#     name = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50)
#     password = models.CharField(max_length=50)
#     picture = models.BinaryField()
#     bio = models.CharField(max_length=100)

#     def __str__(self):
#         return self.email


class Notebook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=100)
    is_favorite = models.BooleanField(default=False)
    last_edited = models.DateTimeField(auto_now_add=True, blank=True)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='blue')
    public = models.BooleanField(default=False)
    # notebook_logo = models.FileField(blank=True)

    def get_absolute_url(self):
        return reverse('vbook:notebook')

    def __str__(self):
        return self.title


class Tag(models.Model):
    title = models.CharField(max_length=20)
    notebook = models.ForeignKey(Notebook, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class URL(models.Model):
    title = models.CharField(max_length=100)
    url = models.URLField()
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='blue')
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Note(models.Model):
    url = models.ForeignKey(URL, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    content = models.TextField()
    delta_object = models.TextField()
    is_favorite = models.BooleanField(default=False)
    last_edited = models.DateTimeField(auto_now_add=True, blank=True)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='blue')
    tag = models.CharField(max_length=20)
    time = models.CharField(max_length=15)

    def __str__(self):
        return self.title

