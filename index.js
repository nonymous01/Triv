var quizData = [
  {
    "question": "Qui était l'entraîneur de l'Égypte lors de la CAN 2017 ?",
    "answers": [
      {"option": "Javier Aguirre", "correct": false},
      {"option": "Aliou Cissé", "correct": false},
      {"option": "Hector Cuper", "correct": true},
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

function checkAnswerAndPlayAgainTomorrow() {
  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();

  // Ajout de l'heure dans tous les messages
  var playedTime = currentHour + ":" + (currentMinute < 10 ? "0" : "") + currentMinute;

  if (answerCheckedToday) {
    showAlert("Vous avez déjà vérifié la réponse aujourd'hui à " + playedTime + ". Revenez demain à la même heure pour un nouveau quiz !");
    return;
  }

  let hasPlayedToday = getCookie("hasPlayedToday");
  if (hasPlayedToday === "true") {
    var remainingTime = calculateRemainingTime(currentHour, currentMinute);
    showAlert("Vous avez déjà joué aujourd'hui à " + playedTime + ". Revenez demain à la même heure pour un nouveau quiz ! Il vous reste " + remainingTime + " minutes pour jouer aujourd'hui.");
    return;
  }

  var selectedAnswer = document.querySelector('input[name="q1"]:checked');
  if (!selectedAnswer) {
    var remainingTime = calculateRemainingTime(currentHour, currentMinute);
    showAlert("Veuillez sélectionner une réponse à " + playedTime + ". Il vous reste " + remainingTime + " minutes pour jouer aujourd'hui.");
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
    var remainingTime = calculateRemainingTime(currentHour, currentMinute);
    resultMessage =
      "Désolé, ce n'est pas la bonne réponse. La bonne réponse est : " +
      getCorrectAnswer(currentQuizQuestion) +
      ". Revenez demain à la même heure (" + playedTime + ") pour un nouveau Quiz. Il vous reste " + remainingTime + " minutes pour jouer aujourd'hui.";
    showAlert(resultMessage);
    document.getElementById(labelId).style.backgroundColor = "red";

    var correctAnswerId = "q1" + String.fromCharCode(97 + currentQuizQuestion.answers.findIndex(answer => answer.correct));
    document.getElementById(correctAnswerId + "-label").style.backgroundColor = "green";
  }

  answerCheckedToday = true;
  setCookie("hasPlayedToday", "true", 1);

  // Ajout de l'heure dans le message de succès
  if (currentHour === 12 && currentMinute === 0) {
    showSuccessAlert("Félicitations !!! Rendez-vous demain à la même heure (" + playedTime + ") pour un nouveau Quiz.");
  }

  animateQuizEnd();
  setCookie("lastPlayed", new Date().toISOString(), 1);
}

function calculateRemainingTime(currentHour, currentMinute) {
  // Calcul du temps restant jusqu'à l'heure de jeu suivante
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
