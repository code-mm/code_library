from django.contrib import admin
from datetime import datetime

from book import models


class BookAdmin(admin.ModelAdmin):
    list_display = ['title1','title2','author','code_book_id']

class BookCopiesAdmin(admin.ModelAdmin):
    list_display = ['id', 'date_added', 'book_title1', 'book_title2', 'book_author', 'book_code_book_id']

    def get_queryset(self, request):
        return models.BookCopies.objects.select_related('book')

    def book_title1(self, obj):
        return obj.book.title1

    def book_title2(self, obj):
        return obj.book.title2

    def book_author(self, obj):
        return obj.book.author

    def book_code_book_id(self, obj):
        return obj.book.code_book_id

class BookLoanReservedAdmin(admin.ModelAdmin):
    list_display = ['id', 'duration', 'reservation_information', 'book_copy_id', 'book_title1', 'book_title2', 'book_author', 'book_code_book_id', 'user_firstname', 'user_lastname', 'user_email']

    def get_queryset(self, request):
        return models.LoanReserved.objects.select_related('book_copy').select_related('book_copy').select_related('user')

    def book_copy_id(self, obj):
        return obj.book_copy.id

    def book_title1(self, obj):
        return obj.book_copy.book.title1

    def book_title2(self, obj):
        return obj.book_copy.book.title2

    def book_author(self, obj):
        return obj.book_copy.book.author

    def book_code_book_id(self, obj):
        return obj.book_copy.book.code_book_id

    def user_firstname(self, obj):
        return obj.user.first_name

    def user_lastname(self, obj):
        return obj.user.last_name

    def user_email(self, obj):
        return obj.user.email

#@admin.register(models.Loan)
class BookLoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'from_date', 'to_date', 'loan_start_information', 'loan_end_information', 'book_copy_id', 'book_title1', 'book_title2', 'book_author', 'book_code_book_id', 'user_firstname', 'user_lastname', 'user_email']

    def get_queryset(self, request):
        return models.Loan.objects.filter(from_date__lt=datetime.date(datetime.now())).filter(to_date__gt=datetime.date(datetime.now())).select_related('book_copy').select_related('book_copy').select_related('user')

    def book_copy_id(self, obj):
        return obj.book_copy.id

    def book_title1(self, obj):
        return obj.book_copy.book.title1

    def book_title2(self, obj):
        return obj.book_copy.book.title2

    def book_author(self, obj):
        return obj.book_copy.book.author

    def book_code_book_id(self, obj):
        return obj.book_copy.book.code_book_id

    def user_firstname(self, obj):
        return obj.user.first_name

    def user_lastname(self, obj):
        return obj.user.last_name

    def user_email(self, obj):
        return obj.user.email

#@admin.register(models.LoanHistory)
class BookLoanHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'from_date', 'to_date', 'loan_start_information', 'loan_end_information', 'book_copy_id', 'book_title1', 'book_title2', 'book_author', 'book_code_book_id', 'user_firstname', 'user_lastname', 'user_email']

    def get_queryset(self, request):
        return models.Loan.objects.filter(to_date__lt=datetime.date(datetime.now())).select_related('book_copy').select_related('book_copy').select_related('user')

    def book_copy_id(self, obj):
        return obj.book_copy.id

    def book_title1(self, obj):
        return obj.book_copy.book.title1

    def book_title2(self, obj):
        return obj.book_copy.book.title2

    def book_author(self, obj):
        return obj.book_copy.book.author

    def book_code_book_id(self, obj):
        return obj.book_copy.book.code_book_id

    def user_firstname(self, obj):
        return obj.user.first_name

    def user_lastname(self, obj):
        return obj.user.last_name

    def user_email(self, obj):
        return obj.user.email


admin.site.register(models.Book, BookAdmin)
admin.site.register(models.BookCopies, BookCopiesAdmin)
admin.site.register(models.LoanReserved, BookLoanReservedAdmin)
admin.site.register(models.Loan, BookLoanAdmin)
admin.site.register(models.LoanHistory, BookLoanHistoryAdmin)
