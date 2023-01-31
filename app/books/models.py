from django.db import models
from django.urls import reverse_lazy


class Book(models.Model):
    # isbn,title,author,year

    id = models.AutoField(primary_key=True)
    isbn = models.CharField('isbn', max_length=50)
    title = models.CharField('title', max_length=50)
    author = models.CharField('author', max_length=50)
    year = models.CharField('year', max_length=50)

    def _str_(self):
        return self.title