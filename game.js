let points = 0;
let timer = 0;
let taskNumber = 0; // Track the current task index

let correctSymbols = [
  ['symbol1.png', 'symbol2.png', 'symbol3.png', 'symbol4.png'], // Task 1
  ['symbol2.png', 'symbol3.png', 'symbol4.png', 'symbol5.png'], // Task 2
  ['symbol3.png', 'symbol4.png', 'symbol5.png', 'symbol6.png'], // Task 3
];

let attempts = 0; // Track the number of attempts for the current task

function updatePoints() {
  document.getElementById('points').textContent = `Point: ${points}`;
}

function updateTimer() {
  document.getElementById('timer').textContent = `Tid: ${timer}s`;
}

function completeTask() {
  if (attempts === 0) {
    points += 250; // Award 250 points for the first correct attempt
  } else {
    points = Math.max(0, points - 50); // Subtract 50 points for each incorrect attempt, but don't go below 0
  }

  updatePoints();

  if (taskNumber < 2) { // Assuming there are 3 tasks
    // Display the next task
    taskNumber++;
    document.querySelector('.bottom-frame h2').textContent = `Opgave ${taskNumber + 1} - Ørnens Øje`;
    resetInputFields();
    attempts = 0; // Reset attempts for the new task
  } else {
    // All tasks completed, stop the timer
    clearInterval(timerInterval);
    
    // Prompt the user to create an account and save data
    createAccount();
  }
}

function checkTask() {
  const userSymbols = [
    document.getElementById('symbol1').value,
    document.getElementById('symbol2').value,
    document.getElementById('symbol3').value,
    document.getElementById('symbol4').value,
  ];

  // Check if user symbols match the correct symbols for the current task
  if (arraysEqual(userSymbols, correctSymbols[taskNumber])) {
    // Symbols are correct, move to the next task
    attempts = 0; // Reset attempts for the next task
    completeTask();
  } else {
    attempts++;
    alert(`Incorrect symbols. Attempt ${attempts}. Please try again.`);
  }
}

// Update the resetInputFields function to reset symbol selectors
function resetInputFields() {
  for (let i = 1; i <= 4; i++) {
    const selectElement = document.getElementById(`symbol${i}`);
    selectElement.selectedIndex = 0;
    updateSymbolDropdown(selectElement);
  }
}

// Utility function to compare arrays
function arraysEqual(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

// Utility function to update the background image of dropdown options
function updateSymbolDropdown(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  selectElement.style.backgroundImage = `url(${selectedOption.getAttribute('data-image')})`;
}

// Function to format the symbol image in the custom dropdown
function formatSymbol(state) {
  if (!state.id) {
    return state.text;
  }
  const $symbol = $('<span><img src="' + state.element.getAttribute('data-image') + '" class="symbol-image" /> ' + state.text + '</span>');
  return $symbol;
}

// Function to prompt the user to create an account
function createAccount() {
  const username = prompt('Enter your username:');
  if (username) {
    // Save user data when all tasks are completed
    saveUserData(username);
  }
}

// Function to save user data
function saveUserData(username) {
  const userData = {
    username: username,
    points: points,
    time: timer,
  };

  // Convert userData to JSON
  const jsonData = JSON.stringify(userData);

  // Send JSON data to a PHP script using AJAX
  $.ajax({
    type: 'POST',
    url: 'saveUserData.php', // Create a PHP file for saving user data
    data: { data: jsonData },
    success: function(response) {
      console.log(response); // Log the server response
    },
    error: function(error) {
      console.error(error); // Log any errors
    }
  });
}

// Dynamically populate the symbol options in the dropdowns
let symbolOptions = Array.from({ length: 10 }, (_, i) => `symbol${i + 1}.png`);

for (let i = 1; i <= 4; i++) {
  const selectElement = document.getElementById(`symbol${i}`);

  for (const symbolOption of symbolOptions) {
    const optionElement = document.createElement('option');
    optionElement.value = symbolOption;
    optionElement.text = '';  // Set an empty text to hide the file name
    optionElement.setAttribute('data-image', symbolOption); // Set the image filename as a data attribute
    selectElement.add(optionElement);
  }

  // Initialize Select2 for the custom dropdown
  $(`#symbol${i}`).select2({
    templateResult: formatSymbol,
    templateSelection: formatSymbol,
  });

  // Add event listener to update the background image when the selection changes
  selectElement.addEventListener('change', () => updateSymbolDropdown(selectElement));
}

// Simple timer logic (increment every second)
const timerInterval = setInterval(() => {
  timer++;
  updateTimer();
}, 1000);

// Initial updates
updatePoints();
updateTimer();
