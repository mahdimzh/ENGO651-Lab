from django.db import models
from books.models import Book
from core.user.models import User

class Review(models.Model):
    book = models.ForeignKey(Book, to_field='id', on_delete=models.CASCADE)
    user = models.ForeignKey(User, to_field='id', on_delete=models.CASCADE)
    # reviewer = models.CharField(max_length=100)
    comment = models.TextField()
    # rating = models.PositiveSmallIntegerField()

    def __str__(self):
        return self.comment