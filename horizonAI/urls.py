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
    path('new_trade', views.new_trade, name='new_trade'),
    path('all_trades', views.all_trades, name='all_trades'),
    path('trade_analysis/<int:identifier>', views.trade_analysis, name='trade_analysis'),
    path('forgot_password', views.forgot_password, name='forgot_password'),
    path('save_new_password/<str:email>/<str:new_password>', views.save_new_password, name='save_new_password'),
    path('journal/retrieve', views.retrieve_journal, name='get_journal'),
    path('trades/all', views.get_all_trades, name='get_all_trades'),
    path('journal/new', views.create_journal, name='journal_new'),
    path('trades/all/analysis', views.trades_analysis, name='trade_analysis'),
    path('get_equity_before/<int:identifier>', views.get_equity_before, name='get_equity_before')
]
