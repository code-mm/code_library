from django.contrib.auth.models import User
from rest_framework import serializers

from book import models


# user
class User(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('id', 'first_name', 'last_name', 'username', 'email')


# book
class BookCopies(serializers.ModelSerializer):
    available = serializers.SerializerMethodField()

    def get_available(self, obj):
       reserved = models.LoanReserved.objects.filter(book_copy_id=obj.id).exists()
       loaned = models.Loan.objects.filter(book_copy_id=obj.id).exists()
       if reserved or loaned:
           return False
       else:
           return True

    class Meta:
        model = models.BookCopies
        fields = ('id', 'date_added', 'available')
        read_only_fields = ('available',)

class Book(serializers.ModelSerializer):
    class Meta:
        model = models.Book
        fields = ('id', 'isbn', 'title1', 'title2', 'author', 'publisher', 'cover', 'designation', 'subject', 'publication_year', 'language', 'code_book_id')


# loan
class LoanReserved(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = models.LoanReserved
        fields = ('id', 'user', 'book_copy', 'duration')

class Loan(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = models.Loan
        fields = ('id', 'user', 'book_copy', 'from_date', 'to_date')
