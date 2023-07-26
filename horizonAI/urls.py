from django.urls import path
from . import views


app_name = 'horizonAI'

urlpatterns = [
    path('', views.home, name='home'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('dictionary', views.dictionary, name='dictionary'),
    path('books', views.books, name='books'),
    path('journal', views.journal, name='journal'),
    path('join_waitlist', views.join_waitlist, name='join_waitlist'),
]
