from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse

from book.models import Book as modelBook
from book.models import BookCopies as modelBookCopies
from book.models import Loan as modelLoan
from book_api.serializers import UserSerializer
from book_api.serializers import BookSerializer
from book_api.serializers import LoanSerializer
from book_api.serializers import LoanOwnSerializer


#
# user
#

class UserProfile(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return User.objects.get(pk=self.request.user.id)

    def list(self, request):
        queryset = self.get_queryset()
        serialized = self.serializer_class(queryset)
        return Response(serialized.data)


#
# book
#

class Book(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        try:
            id = self.kwargs['id']
        except KeyError:
            return modelBook.objects.all().order_by('-id')
        else:
            return modelBook.objects.filter(id=id)


#
# search
#

class Search(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, searchTerm):
        vector = SearchVector('title1', 'title2', 'author', 'isbn', 'designation', 'subject')
        searchQuery = SearchQuery(searchTerm)
        books = modelBook.objects.annotate(rank=SearchRank(vector, searchQuery)).order_by('-rank')
        serialized = self.serializer_class(books, many=True)
        return Response(serialized.data)


#
# loan
#

class Loan(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = LoanSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        try:
            id = self.kwargs['id']
        except KeyError:
            return modelLoan.objects.all().order_by('-id')
        else:
            return modelLoan.objects.filter(book=id).order_by('-id')

    def create(self, request):
        serialized = self.serializer_class(data=request.data, context={'request': request})
        # check if data is valid
        if serialized.is_valid():
            # check if book copy exists and not already lent
            try:
                book = modelBook.objects.get(pk=request.data['book'])
            except modelBook.DoesNotExist:
                return Response({'Error': 'Book does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            if modelLoan.objects.filter(book_id=book.id).filter(Q(from_date__gte=request.data['from_date'], from_date__lt=request.data['to_date']) | Q(to_date__gt=request.data['from_date'], to_date__lte=request.data['to_date'])).exists():
                return Response({'Error': 'Book already lent for given date duration'}, status=status.HTTP_400_BAD_REQUEST)

            # write the loan details to database
            serialized.save()
            return Response({"Success":"Successfully created"}, status=status.HTTP_201_CREATED)

        return Response({'Error': 'Object does not exist or date format invalid.'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, id):
        try:
            loan = modelLoan.objects.get(pk=id)
        except modelLoan.DoesNotExist:
            return Response({'Error': 'Loan does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        if loan.user_id == self.request.user.id:
            loan.delete()
        else:
            return Response({'Error': 'Not owner of loan'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

class LoanOwn(generics.ListAPIView):
    serializer_class = LoanOwnSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return modelLoan.objects.filter(user=self.request.user.id)

    def list(self, request):
        queryset = self.get_queryset()
        serialized = self.serializer_class(queryset, many=True)
        return Response(serialized.data)
