from django.shortcuts import render
from django.http import JsonResponse
from json import loads
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
# from django.contrib.auth import login
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth import login, authenticate, logout
from django.utils import timezone
from datetime import datetime
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
import requests
import random


# Create your views here.
equity = 10000

# account_sid = 'ACc5b451c653c4b18a8c5efcc6730a98c2'
# auth_token = 'd10643cb1677146e0417819d9ded82ad'
# client = Client(account_sid, auth_token)
# number = '+16623042614'
# message = client.messages \
#                 .create(
#                      body="Join Earth's mightiest heroes. Like Kevin Bacon.",
#                      from_=number,
#                      to='+27836041037'
#                  )

# print(message.sid)


def home(request):
    signups = SignUp.objects.all()
    print(signups)
    return render(request, 'horizonAI/home.html')



def dictionary(request):
    return render(request, 'horizonAI/dictionary.html')


def books(request):
    return render(request, 'horizonAI/books.html')


def journal(request):
    return render(request, 'horizonAI/journal.html')


@csrf_exempt
def join_waitlist(request):
    if request.method == 'POST':
        body = loads(request.body)
        email = body.get('email') # Get the email from the AJAX request
        if email:
            # Check if the email already exists in the database
            if not SignUp.objects.filter(email=email).exists():
                signup = SignUp(email=email)
                signup.save()
                return JsonResponse({'message': 'Successfully added email!'})
            else:
                return JsonResponse({'message': 'Email already exists'})

    # Return a failure JSON response if the email is not provided or it's not a POST request
    return JsonResponse({'message': 'Invalid request'}, status=400)


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("horizonAI:dictionary"))
        else:
            return render(request, "horizonAI/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "horizonAI/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("horizonAI:home"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        equity = request.POST['equity']
        phone_number = request.POST['phone-number']
        print(f'Equity is {equity}')

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, phone_number=phone_number)
            user.save()
        except IntegrityError:
            return render(request, "horizonAI/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        save_equity = Initial(username=username, initial_equity=equity, equity_before=equity)
        save_equity.save()
        return HttpResponseRedirect(reverse("horizonAI:dictionary"))
    else:
        return render(request, "horizonAI/register.html")


@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        # Get the raw JSON data from the request body
        data = loads(request.body)

        # Now you can access the 'email' value from the JSON data
        email = data.get('email')

        # Perform your validation here (e.g., check if the email exists in the User model)
        # For example:
        email_exists = User.objects.filter(email=email).exists()
        # Return the response as JSON
        return JsonResponse({'exists': email_exists})

    return render(request, 'horizonAI/forgot_password.html')


from django.contrib.auth.hashers import make_password


def save_new_password(request, email, new_password):
    try:
        user_new_password = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found.'}, status=404)

    hashed_password = make_password(new_password)
    user_new_password.password = hashed_password
    user_new_password.save()
    return JsonResponse({'message': 'New password saved successfully!'})



def new_trade(request):
    save_equity = Initial.objects.get(username=request.user)
    # save_equity.equity_before = save_equity.initial_equity
    total_returned_equity = 0
    value_of_one_pip = 10 * 17
    exchange_rate = 17
    # print(users_trades)

    if request.method == 'POST':
        data = request.POST.get('data')
        # Convert the JSON data back to a Python object if needed
        data = loads(data)
        print(data)
        currency = data[0]
        order_type = data[1]
        position_size = float(data[2])
        strategy = data[3]
        timeframe = data[4]
        entry_point = float(data[5])
        take_profit = float(data[6])
        stop_loss = float(data[7])
        entry_date = data[8]
        exit_date = data[9]
        entry_date = timezone.make_aware(datetime.fromisoformat(entry_date))
        exit_date = timezone.make_aware(datetime.fromisoformat(exit_date))
        outcome = data[10]
        amount = float(data[11])
        reflection = data[12]
        analysis = data[13]
        emotional_bias = data[14]
        exit_price = data[15]
        equity_risked = data[16]
        print(equity_risked)
        roi = (float(amount) / save_equity.initial_equity) * 100
        if outcome == 'Loss':
            roi = -roi
            amount = -amount
        returns = save_equity.initial_equity * (roi/100)
        final_return = save_equity.equity_before + returns
        equity_risked = float(equity_risked)
        possible_gain = position_size * (take_profit - entry_point) * value_of_one_pip
        equity_risked_percentage = round((equity_risked/equity), 4) * 100
        possible_gain_percentage = round((possible_gain/equity), 4) * 100
        returned = calculate_profit_or_loss(currency, position_size, entry_point, stop_loss, take_profit, exchange_rate)
        updated_trade = NewTrade(
            user = request.user,
            symbol = currency,
            order_type = order_type, 
            position_size = position_size,
            strategy = strategy,
            analysis=analysis,
            timeframe = timeframe,
            entry_date = entry_date,
            exit_date = exit_date,
            entry_point = entry_point,
            equity_before = save_equity.equity_before,
            exit_price=exit_price,
            stop_loss = stop_loss,
            take_profit = take_profit,
            outcome = outcome,
            emotional_bias = emotional_bias,
            equity_risked = equity_risked,
            possible_gain = possible_gain,
            equity_risked_percentage = equity_risked_percentage,
            possible_gain_percentage = possible_gain_percentage,
            amount = amount,
            roi = roi,
            reflection = reflection
        )
        updated_trade.save()
        save_equity.equity_before = final_return
        save_equity.save()
        # Return a JSON response (optional)
        return JsonResponse({'message': 'Data received successfully'})
    return render(request, 'horizonAI/new_trade.html', {
        'equity_before': save_equity.equity_before
    })


def all_trades(request):
    # print(User.objects.get(username=request.user).phone_number)
    global equity
    save_equity = Initial.objects.get(username=request.user)
    print(f'Current Equity is {save_equity.equity_before}')
    users_trades = NewTrade.objects.filter(user=request.user).order_by('-id')
    # print(users_trades)
    total_returned_equity = 0
    for each_trade in users_trades:
        roi = each_trade.roi
        # print(f'ROI is {roi}%.')
        total_returned_equity += roi

        date_taken = each_trade.entry_date
        # print(f'Date Taken is {date_taken}')

    if total_returned_equity >= 0:
        total_returned_equity = f'+{total_returned_equity}'
    context = {'context': users_trades, 'total_equity': total_returned_equity}
    return render(request, 'horizonAI/all_trades.html', context)


def trade_analysis(request, identifier):
    print(f'ID is {identifier}')
    unique_trade = NewTrade.objects.get(pk=identifier)
    context = {'context': unique_trade}
    return render(request, 'horizonAI/trade_analysis.html', context)


def calculate_profit_or_loss(asset, lot_size, entry_price, stop_loss, take_profit, exchange_rate):
    # Define the pip value based on the asset
    if asset == "XAUUSD": # Gold
        pip_value = 0.01 / exchange_rate # Use 0.01 instead of 0.0001 for gold
    else: # Currency pair
        pip_value = 0.0001 / exchange_rate
    
    # Calculate the exit price, profit or loss, and profit or loss per pip
    if take_profit > entry_price: # Long trade
        exit_price = take_profit # Assume trade was closed at take profit level
        if asset == "XAUUSD": # Gold
            profit_or_loss = (exit_price - entry_price) * lot_size * pip_value # No need to multiply by 10000 for gold
            profit_or_loss_per_pip = profit_or_loss / ((exit_price - entry_price) * 100) # Divide by the number of pips and multiply by 100 for gold
        else: # Currency pair
            profit_or_loss = (exit_price - entry_price) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
            profit_or_loss_per_pip = profit_or_loss / ((exit_price - entry_price) * 10000) # Divide by the number of pips
    else: # Short trade
        exit_price = stop_loss # Assume trade was closed at stop loss level
        if asset == "XAUUSD": # Gold
            profit_or_loss = (entry_price - exit_price) * lot_size * pip_value # No need to multiply by 10000 for gold
            profit_or_loss_per_pip = profit_or_loss / ((entry_price - exit_price) * 100) # Divide by the number of pips and multiply by 100 for gold
        else: # Currency pair
            profit_or_loss = (entry_price - exit_price) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
            profit_or_loss_per_pip = profit_or_loss / ((entry_price - exit_price) * 10000) # Divide by the number of pips
    
    # Calculate the potential profit, potential loss, and risk and reward ratio
    if take_profit > entry_price: # Long trade
        if asset == "XAUUSD": # Gold
            potential_profit = (take_profit - entry_price) * lot_size * pip_value # No need to multiply by 10000 for gold
            potential_loss = (entry_price - stop_loss) * lot_size * pip_value # No need to multiply by 10000 for gold
        else: # Currency pair
            potential_profit = (take_profit - entry_price) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
            potential_loss = (entry_price - stop_loss) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
    else: # Short trade
        if asset == "XAUUSD": # Gold
            potential_profit = (entry_price - take_profit) * lot_size * pip_value # No need to multiply by 10000 for gold
            potential_loss = (stop_loss - entry_price) * lot_size * pip_value # No need to multiply by 10000 for gold
        else: # Currency pair
            potential_profit = (entry_price - take_profit) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
            potential_loss = (stop_loss - entry_price) * lot_size * 10000 * pip_value # Multiply by 10000 to convert pips to points
    
    risk_and_reward_ratio = potential_profit / potential_loss

    # Return the results as a tuple
    return (profit_or_loss, profit_or_loss_per_pip, potential_profit, potential_loss, risk_and_reward_ratio)


def get_all_trades(request):
    user = request.user
    # account = Account.objects.get(user=user)
    print(f'User is {user}')
    trades = NewTrade.objects.filter(user=user)
    # save_equity = Initial.objects.get(username=request.user)

    serialized_data = []

    for trade in trades:
        obj = {
            'id': trade.pk,
            'account': '',
            'symbol': trade.symbol,
            'trade_type': trade.order_type,
            'entry_price': trade.entry_point,
            'entry_datetime': trade.entry_date,
            'exit_price': trade.exit_price,
            'exit_datetime': trade.exit_date,
            'timeframe': trade.timeframe,
            'position_size': trade.position_size,
            'profit': trade.amount,
            'equity_before': trade.equity_before,
            'take_profit': trade.take_profit,
            'stop_loss': trade.stop_loss,
            'strategy': trade.strategy,
            'emotional_biases': trade.emotional_bias,
            'analysis': trade.analysis,
            'reflection': trade.reflection
        }
        serialized_data.append(obj)

    print('serialized_data',serialized_data)

    return JsonResponse({'trades': serialized_data}, status=200)


def retrieve_journal(request):
    journal = Journal.objects.all().order_by('-datetime')

    entries = []

    for entry in journal:
        obj = {
            'id': entry.id,
            'body': entry.body,
            'last_saved': entry.datetime,
            'last_edited': entry.last_edited,
            'tags': entry.tags
        }
        entries.append(obj)

    return JsonResponse({'entries': entries}, status=200)


def create_journal(request):
    if request.method == 'POST':
        data = loads(request.body)

        journal, _ = Journal.objects.get_or_create(
            id=data.get('id')
        )

        journal.body = data.get('body')
        journal.tags = data.get('tags')

        if (data.get('lastEdited')):
            journal.last_edited = now()

        journal.save()

        return JsonResponse(
            {'message': 'journal was saved successfully'}, 
            status=200
        )


    else:
        return render(request, 'horizonAI/create_journal.html')


def trades_analysis(request):
    return render(request, 'horizonAI/trades_analysis.html')


def get_equity_before(request, identifier):
    equity_before = NewTrade.objects.get(pk=identifier).equity_before
    return JsonResponse({'equity_before': equity_before}, status=200)