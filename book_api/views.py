from django.contrib.auth.models import User
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

from book import models
from book_api import serializers


# user
class UserProfile(APIView):
    def get(self, request, *args, **kwargs):
        user = models.User.objects.get(pk=request.user.id)
        user_serialized = serializers.User(user)
        return Response(user_serialized.data, status=status.HTTP_200_OK)


# book
class Book(APIView):
    def get(self, request, book_id=None, *args, **kwargs):
        if book_id != None:
            try:
                book = models.Book.objects.get(pk=book_id)
                book_serialized = serializers.Book(book)
                return Response(book_serialized.data, status=status.HTTP_200_OK)
            except models.Book.DoesNotExist:
                return Response({'Error': 'Book does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            books = models.Book.objects.all()
            books_serialized = serializers.Book(books, many=True)
            return Response(books_serialized.data, status=status.HTTP_200_OK)

class BookCopies(APIView):
    def get(self, request, book_id=None, *args, **kwargs):
        if book_id != None:
            try:
                book_copies = models.BookCopies.objects.filter(book=book_id)
                book_copies_serialized = serializers.BookCopies(book_copies, many=True)
                return Response(book_copies_serialized.data, status=status.HTTP_200_OK)
            except models.BookCopies.DoesNotExist:
                return Response({'Error': 'Book copy does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            book_copies = models.BookCopies.objects.all()
            book_copies_serialized = serializers.BookCopies(book_copies, many=True)
            return Response(book_copies_serialized.data, status=status.HTTP_200_OK)

class BookNew(APIView):
    def get(self, request, *args, **kwargs):
        books = models.BookCopies.objects.order_by('-date_added').distinct()[:10].select_related('book').only('book')
        book_list = []
        for book in books:
            book_list.append(book.book)
        book_list_serialized = serializers.Book(book_list, many=True)
        return Response(book_list_serialized.data)


# search
class Search(APIView):
    def get(self, request, search_term):
        vector = SearchVector('title1', 'title2', 'author', 'isbn', 'designation', 'subject')
        search_query = SearchQuery(search_term)
        books = models.Book.objects.annotate(rank=SearchRank(vector, search_query)).order_by('-rank')
        books_serialized = serializers.Book(books, many=True)
        return Response(books_serialized.data)


# loan
class LoanReserved(APIView):
    def get(self, request, loan_id=None, *args, **kwargs):
        if loan_id != None:
            try:
                loan = models.LoanReserved.objects.filter(user=self.request.user.id).get(pk=loan_id)
                loan_serialized = serializers.LoanReserved(loan)
                return Response(loan_serialized.data, status=status.HTTP_200_OK)
            except models.LoanReserved.DoesNotExist:
                return Response({'Error': 'Loan does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            loans = models.LoanReserved.objects.filter(user=self.request.user.id)
            loans_serialized = serializers.LoanReserved(loans, many=True)
            return Response(loans_serialized.data, status=status.HTTP_200_OK)

    def post(self, request, loan_id=None, *args, **kwargs):
        loan_serialized = serializers.LoanReserved(data=request.data, context={'request': request})
        MAX_LOANS = 4
        MAX_LOAN_DURATION = 10

        # check if user exceeds maximum loans
        if models.Loan.objects.filter(user=request.user.id).count() >= MAX_LOANS:
            return Response({'Error': 'Maximum loans reached'}, status=status.HTTP_400_BAD_REQUEST)
        if loan_serialized.is_valid():
            # check if duration exceeds maximum loan duration
            if loan_serialized.validated_data['duration'] > MAX_LOAN_DURATION:
                return Response({'Error': 'Maximum loan duration exceeded'}, status=status.HTTP_400_BAD_REQUEST)
            # check if the user already has a copy of the same book on reserved book list or lent list
            try:
                book_id = models.BookCopies.objects.select_related('book').get(pk=loan_serialized.validated_data['book_copy'].id).book.id
            except models.BookCopies.DoesNotExist:
                return Response({'Error': 'Invalid book_copy value'}, status=status.HTTP_400_BAD_REQUEST)
            if models.LoanReserved.objects.select_related('book_copy').filter(user=request.user.id).filter(book_copy__book__id=book_id).count() > 0:
                return Response({'Error': 'Book already on reserved book list'}, status=status.HTTP_400_BAD_REQUEST)
            elif models.Loan.objects.select_related('book_copy').filter(user=request.user.id).filter(user=request.user.id).filter(book_copy__book__id=book_id).count() > 0:
                return Response({'Error': 'Book already lent'}, status=status.HTTP_400_BAD_REQUEST)

            loan_serialized.save()
            return Response({'Success': 'Loan reservation created'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, loan_id=None, *args, **kwargs):
        if loan_id != None:
            try:
                loan = models.LoanReserved.objects.filter(user=self.request.user.id).get(pk=loan_id)
                loan.delete()
                return Response({'Success': 'Loan deleted'}, status=status.HTTP_204_NO_CONTENT)
            except models.LoanReserved.DoesNotExist:
                return Response({'Error': 'Loan does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Error': 'Loan does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class LoanActive(APIView):
    def get(self, request, loan_id=None, *args, **kwargs):
        if loan_id != None:
            try:
                loan = models.Loan.objects.filter(user=self.request.user.id).filter(from_date__lt=datetime.date(datetime.now())).filter(to_date__gt=datetime.date(datetime.now())).get(pk=loan_id)
                loan_serialized = serializers.Loan(loan)
                return Response(loan_serialized.data, status=status.HTTP_200_OK)
            except models.Loan.DoesNotExist:
                return Response({'Error': 'Loan does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            loans = models.Loan.objects.filter(user=self.request.user.id).filter(from_date__lt=datetime.date(datetime.now())).filter(to_date__gt=datetime.date(datetime.now()))
            loans_serialized = serializers.Loan(loans, many=True)
            return Response(loans_serialized.data, status=status.HTTP_200_OK)

    def delete(self, request, loan_id=None, *args, **kwargs):
        if loan_id != None:
            try:
                loan = models.Loan.objects.filter(user=self.request.user.id).filter(from_date__lt=datetime.date(datetime.now())).filter(to_date__gt=datetime.date(datetime.now())).get(pk=loan_id)
                loan.delete()
                return Response({'Success': 'Loan deleted'}, status=status.HTTP_204_NO_CONTENT)
            except models.Loan.DoesNotExist:
                return Response({'Error': 'Loan does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Error': 'Loan does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class LoanHistory(APIView):
    def get(self, request, loan_id=None, *args, **kwargs):
        if loan_id != None:
            try:
                loan = models.Loan.objects.filter(user=self.request.user.id).filter(to_date__lt=datetime.date(datetime.now())).get(pk=loan_id)
                loan_serialized = serializers.Loan(loan)
                return Response(loan_serialized.data, status=status.HTTP_200_OK)
            except models.Loan.DoesNotExist:
                return Response({'Error': 'Loan does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            loans = models.Loan.objects.filter(user=self.request.user.id).filter(to_date__lt=datetime.date(datetime.now()))
            loans_serialized = serializers.Loan(loans, many=True)
            return Response(loans_serialized.data, status=status.HTTP_200_OK)
