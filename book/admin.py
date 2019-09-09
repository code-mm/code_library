from django.contrib import admin
from book import models


admin.site.register(models.BookCopies)
admin.site.register(models.Book)
admin.site.register(models.LoanReserved)
admin.site.register(models.Loan)