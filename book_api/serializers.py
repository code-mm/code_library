from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import serializers

from book.models import Book, BookCopies, Loan


#
# user
#

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email')


#
# book
#

class BookCopiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCopies
        fields = ('id', 'date_added')

class BookSerializer(serializers.ModelSerializer):
    copies = serializers.SerializerMethodField()
    no_copies = serializers.SerializerMethodField()

    def get_copies(self, obj):
        serialized = BookCopiesSerializer(BookCopies.objects.filter(book=obj.id), many=True)
        return  serialized.data

    def get_no_copies(self, obj):
        return len(BookCopies.objects.filter(book=obj.id))

    class Meta:
        model = Book
        fields = ('id', 'isbn', 'title1', 'title2', 'author', 'publisher', 'cover', 'no_copies', 'copies', 'designation', 'subject', 'publication_year', 'language', 'code_book_id')


#
# loan
#

class LoanSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    id = serializers.ReadOnlyField()

    class Meta:
        model = Loan
        fields = ('id', 'user', 'book', 'from_date', 'to_date')

class LoanOwnSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Loan
        fields = ('id', 'book', 'from_date', 'to_date')
