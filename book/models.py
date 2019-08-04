from django.db import models
from django.contrib.auth.models import User

#
# book
#

class Book(models.Model):
    isbn = models.CharField(max_length=20)
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=100)
    publisher = models.CharField(max_length=50)
    cover = models.URLField(max_length=50)
    category = models.CharField(max_length=50)
    topic = models.CharField(max_length=50)
    release_date = models.CharField(max_length=20)
    language = models.CharField(max_length=20)
    code_book_id = models.CharField(max_length=20, default='')

class BookCopies(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    date_added = models.DateField()


#
# loan
#

class Loan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    from_date = models.DateField()
    to_date = models.DateField()