from django.contrib import admin
from .models import Book, BookCopies, Loan

admin.site.register(BookCopies)
admin.site.register(Book)
admin.site.register(Loan)