from django.contrib import admin
from .models import Notebook, Note, URL, Tag

# Register your models here.
admin.site.register(Notebook)
admin.site.register(URL)
admin.site.register(Tag)
admin.site.register(Note)

