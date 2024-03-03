function startGame() {
  // Simple authentication (replace with secure authentication in a real application)
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'demo' && password === 'demo') {
    // Redirect to the game page (replace with actual page navigation logic)
    window.location.href = 'game.html';
  } else {
    alert('Ugyldigt brugernavn eller adgangskode.');
    // Try username: demo, password: demo
  }
}
