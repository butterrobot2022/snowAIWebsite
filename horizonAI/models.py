# from django.contrib.auth.models import User
from django.db import models
import datetime
# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone_number = models.IntegerField()


class SignUp(models.Model):
    email = models.EmailField(unique=True)
    timestamp = models.DateTimeField(default=datetime.datetime.now())


    def __str__(self):
        return f'New SignUp email is {self.email}'


class NewTrade(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default='')
    symbol = models.CharField(max_length=150)
    order_type = models.CharField(max_length=10)
    position_size = models.FloatField()
    strategy = models.CharField(max_length=150, null=True, blank=True)
    analysis = models.CharField(max_length=5000, blank=True)
    timeframe = models.CharField(max_length=150)
    equity_before = models.FloatField()
    entry_date = models.DateTimeField()
    exit_date = models.DateTimeField()
    entry_point = models.FloatField()
    stop_loss = models.FloatField()
    exit_price = models.FloatField()
    take_profit = models.FloatField()
    outcome = models.CharField(max_length=100)
    emotional_bias = models.CharField(max_length=50, blank=True)
    amount = models.FloatField()
    roi = models.FloatField()
    equity_risked = models.FloatField(blank=True)
    possible_gain = models.FloatField(blank=True)
    equity_risked_percentage = models.FloatField(blank=True)
    possible_gain_percentage = models.FloatField(blank=True)
    reflection = models.CharField(max_length=5000, blank=True)


class Account(models.Model):
  user = models.ForeignKey(User, models.CASCADE, name='account')
  initial_equity = models.FloatField()
  name = models.CharField(default='Test', max_length=50)
  currency = models.CharField(default='ZAR', max_length=3)
  equity = models.FloatField(default=0)

  def __str__(self):
    return f'{self.name} ({self.currency}) : {self.equity}'


class Journal(models.Model):
  id = models.CharField(max_length=50, primary_key=True)
  body = models.TextField(max_length=5000)
  datetime = models.DateTimeField(auto_now_add=True)
  last_edited = models.DateTimeField(blank=True, null=True)
  tags = models.CharField(max_length=500, blank=True, null=True)

  def __str__(self):
    return f'ID: {self.id}\nSaved: {self.datetime}'
  

all_symbols = ['USDJPY', 'EURUSD', 'GBPUSD', 'XAUUSD', 'AUDUSD', 'USDCHF', 'NZDUSD', 'USDCAD',
  'EURJPY', 'GBPJPY', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY', 'EURAUD', 'EURGBP', 'EURNZD',
  'EURCAD', 'GBPAUD', 'GBPCAD', 'GBPNZD', 'AUDCAD', 'AUDCHF', 'AUDNZD', 'CADCHF',
  'CADNZD', 'NASDAQ (NAS100)', 'US30', 'CHFJPY', 'CHFUSD', 'EURCHF', 'EURDKK',
  'EURHKD', 'EURHUF', 'EURNOK', 'EURPLN', 'EURSEK', 'EURTRY', 'EURZAR', 'GBPCHF',
  'GBPHKD', 'GBPNOK', 'GBPSGD', 'AUDSGD', 'NZDSGD', 'CADSGD', 'CHFSGD', 'CHFZAR',
  'USDMXN', 'USDZAR', 'USDHKD', 'USDSGD', 'USDNOK', 'USDSEK', 'USDDKK', 'USDCNH',
  'USDTHB', 'USDPLN', 'USDCZK', 'USDHUF', 'USDBRL', 'USDRUB', 'USDKRW', 'USDCAD',
  'AUDNZD', 'NZDCAD', 'AUDCHF', 'AUDJPY', 'AUDCAD', 'AUDUSD', 'AUDHKD', 'NZDUSD',
  'NZDJPY', 'NZDCHF', 'NZDSGD', 'NZDHKD', 'CADCHF', 'CADJPY', 'CADSGD', 'CADHKD',
  'CADNOK', 'CADSEK', 'CADDKK', 'CHFJPY', 'CHFAUD', 'CHFNZD', 'CHFUSD', 'CHFEUR', 
  'CHFGBP', 'CHFSEK', 'CHFDKK', 'CHFNOK', 'CHFPLN', 'CHFHUF', 'CHFCZK', 'CHFTRY',
  'CHFZAR', 'JPYSGD', 'JPYHKD', 'JPYNOK', 'JPYSEK', 'JPYDKK', 'JPYPLN', 'JPYHUF',
  'JPYCZK', 'JPYTRY', 'JPYZAR', 'GER40'
]

all_symbols = list(dict.fromkeys(all_symbols))

SYMBOLS = [(symbol, symbol) for symbol in all_symbols]

TRADE_TYPE = [
  ('BUY', 'Buy'),
  ('SELL', 'Sell'),
  ('BUY_LIMIT', 'Buy Limit'),
  ('SELL_LIMIT', 'Sell Limit'),
  ('BUY_STOP', 'Buy Stop'),
  ('SELL_STOP', 'Sell Stop'),
]

TIMEFRAME = [
  ('1MIN', '1 MIN'),
  ('5MIN', '5 MIN'),
  ('15MIN', '15 MIN'),
  ('30MIN', '30 MIN'),
  ('1HR', '1 HR'),
  ('4HR', '4 HR'),
  ('DAY', 'DAY'),
  ('WEEK', 'WEEK'),
  ('MON', 'MON'),
]

TRANSACTION_TYPE = [
  ('DEPOSIT', 'DEPOSIT'),
  ('WITHDRAW', 'WITHDRAW'),
  ('TRADE_WIN', 'TRADE_WIN'),
  ('TRADE_LOSS', 'TRADE_LOSS'),
]


class Transaction(models.Model):
  account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transaction_account')
  transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE)
  amount = models.FloatField()
  balance = models.FloatField()
  datetime = models.DateTimeField()


class Initial(models.Model):
  username = models.CharField(max_length=120)
  initial_equity = models.FloatField()
  equity_before = models.FloatField()

