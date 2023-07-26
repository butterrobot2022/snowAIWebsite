from django.shortcuts import render
from django.http import JsonResponse
from json import loads
from .models import SignUp, User
import datetime
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
# from django.contrib.auth import login
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import login, authenticate



# Create your views here.


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
        # if password != confirmation:
        #     return render(request, "horizonAI/register.html", {
        #         "message": "Passwords must match."
        #     })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "horizonAI/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("horizonAI:dictionary"))
    else:
        return render(request, "horizonAI/register.html")

