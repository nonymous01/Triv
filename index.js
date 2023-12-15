// Vérifier si l'utilisateur a déjà répondu aujourd'hui 
function hasPlayedToday() {
  // Obtenir le cookie
  let lastPlayed = getCookie("lastPlayed");

  // Vérifier la date
  if (!lastPlayed) {
      return false;
  }

  var score = 0;

  // Obtenir la réponse sélectionnée
  var selectedAnswer = document.querySelector('input[name="q1"]:checked');

  // Vérifier la réponse
  if (selectedAnswer && selectedAnswer.value === "paris") {
    score++;
  }

  // Afficher le résultat
  var resultMessage = "Votre score : " + score + "/1";
  if (score === 1) {
    resultMessage += " Bravo, vous avez répondu correctement à toutes les questions!";
  } else {
    resultMessage += " Merci d'avoir participé au quiz!";
  }
  document.getElementById("quiz-result").innerText = resultMessage;

  // Rendre la div "gatter" visible
  document.getElementById('gatter').style.display = 'block';
}
  // Extraire la date  
  let lastPlayedDate = new Date(lastPlayed);

  // Comparer à aujourd'hui
  let today = new Date();
  return (
      lastPlayedDate.getDate() == today.getDate() &&
      lastPlayedDate.getMonth() == today.getMonth() &&
      lastPlayedDate.getFullYear() == today.getFullYear()
  );
}

function playQuiz() {
  // Si déjà joué aujourd'hui
  if (hasPlayedToday()) {
      showAlert("Vous avez déjà joué au quiz aujourd'hui!");
      return;
  }

  // Code du quiz ici...

  // Animation pour indiquer la fin du quiz
  animateQuizEnd();

  // Mémoriser la date du jour
  setCookie("lastPlayed", new Date().toISOString(), 1);
}

function animateQuizEnd() {
  // Ajouter une classe CSS pour déclencher une animation
  document.body.classList.add('quiz-ended');

  // Retirer la classe après une courte période pour réinitialiser l'animation
  setTimeout(() => {
      document.body.classList.remove('quiz-ended');
  }, 2000); // 2000 millisecondes (2 secondes) ici, ajustez selon vos besoins
}

function setCookie(name, value, expirationInDays) {
  let date = new Date()
  date.setTime(date.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function showAlert(message) {
  // Afficher une alerte personnalisée avec des styles CSS
  alert(message);
}
