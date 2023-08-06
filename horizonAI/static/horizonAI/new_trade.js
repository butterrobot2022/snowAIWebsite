document.addEventListener('DOMContentLoaded', function() {
    let allElements = []
    // CKEDITOR.replace('editor');

    function checkFormValidation() {
        // Get the form element
        const form = document.querySelector('form');

        // Get the required dropdown elements
        const symbolDropdown = form.querySelector('#symbolDropdown');
        const orderTypeDropdown = form.querySelector('#orderTypeDropdown');
        const timeframeDropdown = form.querySelector('#timeframeDropdown');
        const positionSize = form.querySelector('#position-size');
        const strategy = form.querySelector('#strategy')
        const entryPoint = form.querySelector('#entry-point');
        const takeProfit = form.querySelector('#take-profit');
        const stopLoss = form.querySelector('#stop-loss');
        const entryDate = form.querySelector('#entryDateInput');
        const exitDate = form.querySelector('#exitDateInput');
        const tradeOutcome = form.querySelector('#outcome');
        const amount = form.querySelector('#amount');
        const editorContent = document.getElementById('learnt-today-editor');
        // const plainText = new DOMParser().parseFromString(editorContent, 'text/html').body.textContent;
        const whyAnalysis = form.querySelector('#why-analysis');
        const emotionalBias = form.querySelector('#emotional-bias');
        const exitPrice = document.getElementById('exit-price');
        const equityBefore = parseFloat(document.getElementById('equity_before').innerHTML);

        const calculateEquityRisked = (entry, sl, exit, profit, equity_before) => {

            console.log('entry', entry);
            console.log('sl', sl);
            console.log('exit', exit);
            console.log('profit', profit);
            console.log('equityBefore', equityBefore);

            if (profit <= 0) {
              const ans = -(profit / equity_before) * 100;
              return ans % 1 === 0 ? ans : ans.toFixed(2);
            } 
        
            // If negative, convert to a positive number
            const a = Number((exit - entry).toFixed(5)) < 0 
              ? -(Number((exit - entry).toFixed(5)))
              : Number((exit - entry).toFixed(5));
        
            // If negative, convert to a positive number
            const b = Number((sl - entry).toFixed(5)) < 0 
              ? -(Number((sl - entry).toFixed(5)))
              : Number((sl - entry).toFixed(5));
        
            const ans = ((100 * profit * b) / (a * equity_before));
        
            return ans % 1 === 0 ? ans : ans.toFixed(2);
          }

          const equityRisked = calculateEquityRisked(parseFloat(entryPoint.value), parseFloat(stopLoss.value), parseFloat(exitPrice.value), parseFloat(amount.value), equityBefore);
        if (symbolDropdown.value === '') {
            alert('Please select a symbol.');
            return false; // Prevent form submission
        } else if (orderTypeDropdown.value === '') {
            alert('Please select an order type.');
            return false;
        } else if (positionSize.value === '') {
            alert('Please select a position size.');
            return false;
        } 
        else if (whyAnalysis.value === '') {
            alert('Please enter an analysis.')
            return false;
        }
        else if (timeframeDropdown.value === '') {
            alert('Please select a timeframe.');
            return false;
        } else if (entryPoint.value === '') {
            alert('Please select an entry point value.');
            return false;
        } else if (exitPrice.value === '') {
            alert('Please select an exit price value.');
            return false;
        } 
        else if (takeProfit.value === '') {
            alert('Please select a take profit value.');
            return false;
        } else if (stopLoss.value === '') {
            alert('Please select a stop loss value.');
            return false;
        } else if (entryDate.value === '') {
            alert('Please select an entry date value.');
            return false;
        } else if (exitDate.value === '') {
            alert('Please select an exit date value.');
            return false;
        } else if (tradeOutcome.value === '') {
            alert('Please select a trade outcome.');
            return false;
        }
        else if (emotionalBias.value === '') {
            alert('Please select an option for emotional bias.');
            return false;
        }
        // All required fields have a selected value, allow form submission
        allElements = [symbolDropdown.value, orderTypeDropdown.value, positionSize.value, strategy.value, timeframeDropdown.value, 
        entryPoint.value, takeProfit.value, stopLoss.value, entryDate.value, exitDate.value, tradeOutcome.value, amount.value, editorContent.value, whyAnalysis.value, emotionalBias.value, exitPrice.value, equityRisked]
        return true;
    }

    // Add an event listener to the "Save" button to trigger form validation
    document.querySelector('.save-button-trade').addEventListener('click', function (event) {
        if (!checkFormValidation()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
        else if (!validatePositionSize()){
            alert('Please enter a valid position size.');
        }
        else if (!validateEntryPoint()) {
            alert('Please entry a valid entry point.');
        }
        else if (!validateTakeProfit()) {
            alert('Please select a valid take profit.');
        } else if (!validateStopLoss()) {
            alert('Please enter a valid stop loss.')
        } 
        else if (!checkFuture()) {
            alert('Entry Date cannot be in the future.')
        } else if (!checkFutureExit()) {
            alert('Exit Date cannot be in the future.')
        }
        else if (!checkEntryExitDates()) {
            alert('Entry Date cannot be later than Exit Date.');
        }
        else if (!validateTPSLBuy()) {
            alert('Invalid Take Profit or Stop Loss for a Buy order.');
        } else if (!validateTPSLSell()) {
            alert('Invalid Take Profit or Stop Loss for a Sell order.');
        }
        else if (!checkFloatInput()) {
            alert('Please enter an amount.');
        } 
        else {
            // alert('All Clear Dawg!');
            console.log(`All Elements are ${allElements}`);

            const csrftoken = getCookie('csrftoken');
            
            // Send data to the Django view using fetch
            const formData = new FormData();
            formData.append('data', JSON.stringify(allElements));

  // Send data to the Django view using fetch
        fetch('new_trade', {
            method: 'POST',
            headers: {
            // Remove 'Content-Type' header as we are using FormData
            'X-CSRFToken': csrftoken, // Include the CSRF token in the request headers
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
            // Handle the response if needed (e.g., show a success message)
            console.log(`Url is ${allTradesUrl}`);
            window.location.href = allTradesUrl;
            })
            .catch(error => {
            // Handle any errors that occurred during the fetch request
            console.error('Error:', error);
            });
            

        }
    });
});

// Add an event listener to the position-size input
const positionSizeInput = document.getElementById('position-size');
positionSizeInput.addEventListener('input', validatePositionSize);

function validatePositionSize() {
    const positionSizeValue = positionSizeInput.value;
    const positionSizePattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!positionSizePattern.test(positionSizeValue) || positionSizeValue === '' || positionSizeValue === '0' || positionSizeValue === '0.0') {
        // If the input is not a valid float, show an error message or take appropriate action
        // console.log("Invalid position size. Please enter a valid float number.");
        return false;
    } else {
        // Input is a valid float
        // console.log("Valid position size: " + positionSizeValue);
        return true;
    }
}

// Add an event listener to the entry-point input
const entryPointInput = document.getElementById('entry-point');
entryPointInput.addEventListener('input', validateEntryPoint);

function validateEntryPoint() {
    const entryPointValue = entryPointInput.value;
    const entryPointPattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!entryPointPattern.test(entryPointValue) || entryPointValue === '0') {
        // If the input is not a valid float, show an error message or take appropriate action
        return false;
    } else {
        // Input is a valid float
        return true;
    }
}


// Add an event listener to the take-profit input
const takeProfitInput = document.getElementById('take-profit');
takeProfitInput.addEventListener('input', validateTakeProfit);

function validateTakeProfit() {
    const takeProfitValue = takeProfitInput.value;
    const takeProfitPattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!takeProfitPattern.test(takeProfitValue) || takeProfitValue === '0') {
        // If the input is not a valid float, show an error message or take appropriate action
        // console.log("Invalid take profit. Please enter a valid float number.");
        return false;
    } else {
        // Input is a valid float
        // console.log("Valid take profit: " + takeProfitValue);
        return true;
    }
}

// Add an event listener to the stop-loss input
const stopLossInput = document.getElementById('stop-loss');
stopLossInput.addEventListener('input', validateStopLoss);

function validateStopLoss() {
    const stopLossValue = stopLossInput.value;
    const stopLossPattern = /^[0-9]+(\.[0-9]+)?$/;

    if (!stopLossPattern.test(stopLossValue) || stopLossValue === '0') {
        // If the input is not a valid float, show an error message or take appropriate action
        // console.log("Invalid stop loss. Please enter a valid float number.");
        return false;
    } else {
        // Input is a valid float
        // console.log("Valid stop loss: " + stopLossValue);
        return true;
    }
}


function checkEntryExitDates() {
    const entryDateInput = document.getElementById('entryDateInput');
    const exitDateInput = document.getElementById('exitDateInput');

    // Get the values of the date inputs
    const entryDateValue = entryDateInput.value;
    const exitDateValue = exitDateInput.value;

    // Convert the date strings to Date objects
    const entryDate = new Date(entryDateValue);
    const exitDate = new Date(exitDateValue);

    // Compare the dates
    if (entryDate > exitDate) {
        // alert('Entry Date cannot be later than Exit Date.');
        return false;
    } else {
        return true;
    }
}



function checkFuture() {
    const currentDate = new Date();
    const entryDateInput = document.getElementById('entryDateInput');
    const entryDateValue = entryDateInput.value;
    const entryDate = new Date(entryDateValue);
    if (entryDate > currentDate) {
        return false;
    } else {
        return true;
    }
}


function checkFutureExit() {
    const currentDate = new Date();
    const exitDateInput = document.getElementById('exitDateInput');
    const exitDateValue = exitDateInput.value;
    const exitDate = new Date(exitDateValue);
    if (exitDate > currentDate) {
        return false;
    } else {
        return true;
    }

}

function validateTPSLBuy() {
    const orderType = document.getElementById('orderTypeDropdown').value;
    const entryPoint = parseFloat(document.getElementById('entry-point').value);
    const takeProfit = parseFloat(document.getElementById('take-profit').value);
    const stopLoss = parseFloat(document.getElementById('stop-loss').value);

    // Check if TP and SL are valid based on the order type
    if (orderType === 'Buy' && (takeProfit <= entryPoint || stopLoss >= entryPoint)) {
        return false;
    }  else {
        return true;
    }
}

function validateTPSLSell() {
    const orderType = document.getElementById('orderTypeDropdown').value;
    const entryPoint = parseFloat(document.getElementById('entry-point').value);
    const takeProfit = parseFloat(document.getElementById('take-profit').value);
    const stopLoss = parseFloat(document.getElementById('stop-loss').value);

    // Check if TP and SL are valid based on the order type
    if (orderType === 'Sell' && (takeProfit >= entryPoint || stopLoss <= entryPoint)) {
        return false;
    } else {
        return true;
    }
   
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }


  function checkFloatInput() {
    // Create a regular expression pattern to match an float
    const floatPattern = /^[0-9]+(\.[0-9]+)?$/;

    const inputValue = document.getElementById('amount').value;

    if (floatPattern.test(inputValue)) {
        return true
        // Do something with the valid input
    } else {
        return false;
        // Display an error message or take appropriate action
    }
}  