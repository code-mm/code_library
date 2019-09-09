from django.urls import path

from book_api import views


urlpatterns = [
    path('userProfile/', views.UserProfile.as_view()),
    path('book/', views.Book.as_view()),
    path('book/<int:book_id>/', views.Book.as_view()),
    path('book/<int:book_id>/copies/', views.BookCopies.as_view()),
    path('book/new/', views.BookNew.as_view()),
    path('search/<str:search_term>/', views.Search.as_view()),
    path('loan/reserved/', views.LoanReserved.as_view()),
    path('loan/reserved/<int:loan_id>/', views.LoanReserved.as_view()),
    path('loan/active/', views.LoanActive.as_view()),
    path('loan/active/<int:loan_id>/', views.LoanActive.as_view()),
    path('loan/history/', views.LoanHistory.as_view()),
    path('loan/history/<int:loan_id>/', views.LoanHistory.as_view()),
]