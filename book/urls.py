from django.urls import path, include
from django.contrib import admin
from django.views.generic.base import RedirectView
from book.views import logout


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/', include('book_api.urls')),
    path('login/', RedirectView.as_view(url='/auth/login/google-oauth2/', permanent=False), name='login'),
    path('logout/', logout, name='logout'),
    path('', include('book_webapp.urls'), name='home')
]
