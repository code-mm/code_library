from django.db import models
from django.contrib.auth.models import User

#
# book
#

class BookAuthor(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)

class BookPublisher(models.Model):
    name = models.CharField(max_length=20)

class BookCategory(models.Model):
    name = models.CharField(max_length=5)

class BookTopic(models.Model):
    name = models.CharField(max_length=40)

class BookLanguage(models.Model):
    name = models.CharField(max_length=50)

class Book(models.Model):
    isbn = models.CharField(max_length=20)
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=100)
    publisher = models.CharField(max_length=50, default="")
    cover = models.URLField(max_length=200)
    category = models.CharField(max_length=3)
    topic = models.CharField(max_length=50)
    #edition = models.IntegerField()
    release_date = models.CharField(max_length=20)
    language = models.CharField(max_length=20)

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