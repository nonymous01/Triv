var quizData = [
  {
    "question": "Qui était l'entraîneur de l'équipe nationale du Sénégal lors de la CAN 2019 remportée par l'Algérie ?",
    "answers": [
      {"option": "Clarence Seedorf", "correct": false},
      {"option": "Aliou Cissé", "correct": true},
      {"option": "avier Aguirre", "correct": false},
      {"option": "Hervé Renard", "correct": false}
    ]
  }
];

var answerCheckedToday = false;

populateQuiz(quizData);

function populateQuiz(quizData) {
  var questionContainer = document.querySelector(".titre");
  var answerContainer = document.querySelector(".dfghjkl");

  var randomQuestion = quizData[Math.floor(Math.random() * quizData.length)];

  questionContainer.querySelector(".question").textContent = randomQuestion.question;

  answerContainer.innerHTML = "";
  var gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");

  randomQuestion.answers.forEach(function (answer, index) {
    var gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    var input = document.createElement("input");
    input.type = "radio";
    input.name = "q1";
    input.value = answer.option;
    input.id = "q1" + String.fromCharCode(97 + index);

    var label = document.createElement("label");
    label.htmlFor = input.id;
    label.id = input.id + "-label";
    label.textContent = answer.option;

    gridItem.appendChild(input);
    gridItem.appendChild(label);
    gridContainer.appendChild(gridItem);
  });

  answerContainer.appendChild(gridContainer);
}

function resetQuizState() {
  answerCheckedToday = false;
  setCookie("hasPlayedToday", "false", 1);
}

function canPlayQuiz() {
  var lastPlayedTime = getCookie("lastPlayed");
  if (!lastPlayedTime) {
    return true;
  }

  var lastPlayed = new Date(lastPlayedTime);
  var currentTime = new Date();
  return lastPlayed.getDate() !== currentTime.getDate();
}

function checkAnswerAndPlayAgainTomorrow() {
  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();

  var playedTime = currentHour + ":" + (currentMinute < 10 ? "0" : "") + currentMinute;

  if (!canPlayQuiz()) {
    showAlert("Vous avez déjà joué aujourd'hui. Revenez demain à la même heure pour un nouveau quiz !");
    return;
  }

  var selectedAnswer = document.querySelector('input[name="q1"]:checked');
  if (!selectedAnswer) {
    showAlert("Veuillez sélectionner une réponse ");
    return;
  }

  var resultMessage = "";
  var labelId = selectedAnswer.id + "-label";
  var currentQuestion = document.querySelector(".titre .question").textContent;
  var currentQuizQuestion = quizData.find(question => question.question === currentQuestion);

  if (currentQuizQuestion && selectedAnswer.value === getCorrectAnswer(currentQuizQuestion)) {
    resultMessage = "Félicitations !!! Rendez-vous demain à la même heure (" + playedTime + ") pour un nouveau Quiz.";
    showSuccessAlert(resultMessage);
  } else {
    resultMessage =
      "Désolé, ce n'est pas la bonne réponse. La bonne réponse est : " +
      getCorrectAnswer(currentQuizQuestion) +
      ". Revenez demain à la même heure pour un nouveau Quiz. ";
    showAlert(resultMessage);
    document.getElementById(labelId).style.backgroundColor = "red";

    var correctAnswerId = "q1" + String.fromCharCode(97 + currentQuizQuestion.answers.findIndex(answer => answer.correct));
    document.getElementById(correctAnswerId + "-label").style.backgroundColor = "green";
  }

  answerCheckedToday = true;
  setCookie("hasPlayedToday", "true", 1);

  var nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(12, 0, 0, 0);
  setCookie("nextQuizReset", nextDay.toISOString(), 1);

  animateQuizEnd();
  setCookie("lastPlayed", new Date().toISOString(), 1);
}

function calculateRemainingTime(currentHour, currentMinute) {
  var remainingMinutes = 60 - currentMinute;

  if (currentHour === 12) {
    remainingMinutes = 24 * 60 - currentMinute;
  }

  return remainingMinutes;
}

function getCorrectAnswer(question) {
  var correctAnswer = question.answers.find(answer => answer.correct);
  return correctAnswer ? correctAnswer.option : null;
}

function animateQuizEnd() {
  document.body.classList.add('quiz-ended');

  setTimeout(() => {
    document.body.classList.remove('quiz-ended');
  }, 2000);
}

function setCookie(name, value, expirationInDays) {
  let date = new Date();
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
  document.getElementById('custom-alert-message').innerText = message;
  document.getElementById('custom-alert').style.display = 'block';
}

function showSuccessAlert(message) {
  document.getElementById('custom-alert-message-success').innerText = message;
  document.getElementById('custom-alert-success').style.display = 'block';
}

function closeCustomAlert() {
  document.getElementById('custom-alert').style.display = 'none';
}

function closeCustomAlertSuccess() {
  document.getElementById('custom-alert-success').style.display = 'none';
}

// Appelez cette fonction au début pour vérifier si l'utilisateur peut jouer au quiz maintenant.
if (canPlayQuiz()) {
  resetQuizState();
}
