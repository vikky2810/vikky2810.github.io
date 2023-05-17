const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
  const guessInput = document.getElementById("guessInput");
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    setMessage("Please enter a valid number between 1 and 100.");
    return;
  }

  attempts++;

  if (guess === secretNumber) {
    setMessage(`Congratulations! You guessed the number in ${attempts} attempts.`);
    guessInput.disabled = true;
  } else if (guess < secretNumber) {
    setMessage("Try a higher number.");
  } else {
    setMessage("Try a lower number.");
  }

  guessInput.value = "";
  guessInput.focus();
}

function setMessage(message) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
}
