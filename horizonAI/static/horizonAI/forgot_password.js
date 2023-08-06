document.addEventListener('DOMContentLoaded', function() {



let emailDoesExist = false;
let trueCode = 0;

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission for now, we'll handle it later

    let handlePasswords = false;
    let passwordDivShown = false;

    const email = document.getElementById('forgot_password_email').value;
    const emailSent = document.getElementById('email-sent')
    const emailDiv = document.getElementById('forgot-email');
    const enterCode = document.getElementById('enter-code-div');
    const emailDoesNotExist = document.querySelector('.email-does-not-exist');
    const enteredCode = document.querySelector('#forgot-code');
    const codesDoNotMatch = document.querySelector('#codes-do-not-match');
    const createNewPassword = document.querySelector('#create-new-password-div');

    // Prepare the data to be sent as an object
    const data = {
        email: email
    };

    // Make the fetch request
    if (emailDoesExist === false) {

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        // Handle the response here as needed
        if (response.exists === true) {
            // alert('It exists yo!')
            emailSent.style.display = 'block';
            emailDiv.style.display = 'none';
            enterCode.style.display = 'block';
            emailDoesNotExist.style.display = 'none';

            const sendCodeURL = `send_code/${email}`;
            fetch(sendCodeURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken() // Function to get the CSRF token from your Django template
                },
                body: JSON.stringify({ verification_code: response.verification_code })
            })
            .then(response => response.json())
            .then(response => {
                // Handle the response here if needed
                trueCode = response.verification_code
                emailDoesExist = true;
            })
            .catch(error => {
                // Handle errors here
            });


        } else {
            // alert('It doesnt exist yo!')
            emailDoesNotExist.style.display = 'block';
        }
    })
    .catch(error => {
        // Handle errors here
    });
    }

    if (emailDoesExist && !handlePasswords) {
            // do something
        if (enteredCode.value !== trueCode) {
            alert('Passwords do not match!');
        } else {
            enterCode.style.display = 'none';
            emailSent.style.display = 'none';
            handlePasswords = true;
        }

    if (handlePasswords) {
        //  do something
        createNewPassword.style.display = 'block';
        passwordDivShown = true;
        const password = document.getElementById("newPassword").value;
        const confirmation = document.getElementById("confirmPassword").value;
        if (checkPasswords(password, confirmation)) {
            // save the new data to the django server
            // reload to login page
            fetch(`save_new_password/${email}/${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(), // Function to get the CSRF token from your Django template
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(response => {
                    // Handle the response here if needed
                    loginURL = 'login'
                    console.log(`${response}, loginURL is ${loginURL}`);
                    // Optionally, you can redirect to the login page after saving the password
                    alert(`Login URL is ${loginURL}`)
                    window.location.href = loginURL; // Replace '/login' with the actual login page URL
                })
                .catch(error => {
                    // Handle errors here
                });
        }
    }
    }
});
});


function getCSRFToken() {
    // Function to get the CSRF token from your Django template
    var csrfCookie = document.cookie.match(/csrftoken=([\w-]+)/);
    return csrfCookie ? csrfCookie[1] : null;
}


function checkPasswords(password, confirmation) {

    const minLength = 10; // Minimum password length

    // Regular expressions for individual password requirements
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /\d/;
    const specialCharacterPattern = /[@$!%*?&]/;

    // Check if passwords match
    if (password != '' && confirmation != '') {

    if (password !== confirmation) {
        alert("Passwords do not match!");
        return false;
    }

    // Check minimum password length
    if (password.length < minLength) {
        alert(`Password should be at least ${minLength} characters long.`);
        return false;
    }

    // Check uppercase letter requirement
    if (!uppercasePattern.test(password)) {
        alert("Password should contain at least one uppercase letter.");
        return false;
    }

    // Check lowercase letter requirement
    if (!lowercasePattern.test(password)) {
        alert("Password should contain at least one lowercase letter.");
        return false;
    }

    // Check number requirement
    if (!numberPattern.test(password)) {
        alert("Password should contain at least one number.");
        return false;
    }

    // Check special character requirement
    if (!specialCharacterPattern.test(password)) {
        alert("Password should contain at least one special character (@, $, !, %, *, ?, or &).");
        return false;
    }

    if (password === confirmation) {
        alert('Passwords do match and they meet all the requirments!');
        return true;
    }
}
}
