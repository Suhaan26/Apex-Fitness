let exercises = window.exercises || [];
let current = 0;
let time = 30;
let timerInterval = null;
let sessionPoints = 0;

const title = document.getElementById("exerciseTitle");
const stepsDiv = document.getElementById("steps");
const progress = document.getElementById("progressText");
const list = document.getElementById("exerciseList");
const pauseBtn = document.getElementById("pauseBtn");
const timerDisplay = document.getElementById("timer");

function renderList() {
  list.innerHTML = "";
  exercises.forEach((ex, i) => {
    let div = document.createElement("div");
    div.className = "exercise-item";
    div.innerText = ex.name;
    if (i === 0) div.classList.add("active");
    list.appendChild(div);
  });
}

function updateExercise() {
  title.innerText = exercises[current].name;
  stepsDiv.innerHTML = "";
  exercises[current].steps.forEach((step, i) => {
    let p = document.createElement("p");
    p.innerText = (i + 1) + ". " + step;
    stepsDiv.appendChild(p);
  });
  if (exercises[current].safety) {
    let safetyDiv = document.createElement("div");
    safetyDiv.className = "safety-tip";
    safetyDiv.innerText = "⚠️ Safety: " + exercises[current].safety;
    stepsDiv.appendChild(safetyDiv);
  }
  progress.innerText = "Exercise " + (current + 1) + " / " + exercises.length + "  •  " + sessionPoints + " pts";
  document.querySelectorAll(".exercise-item").forEach(item => item.classList.remove("active"));
  document.querySelectorAll(".exercise-item")[current].classList.add("active");
}

function startTimer() {
  clearInterval(timerInterval);
  time = 30;
  timerDisplay.innerText = time;
  timerInterval = setInterval(() => {
    time--;
    timerDisplay.innerText = time;
    if (time <= 0) clearInterval(timerInterval);
  }, 1000);
}

function togglePause() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    pauseBtn.innerText = "RESUME";
  } else {
    startTimer();
    pauseBtn.innerText = "PAUSE";
  }
}

function nextExercise() {
  sessionPoints += 50;
  if (current < exercises.length - 1) {
    current++;
    updateExercise();
    startTimer();
    if (current === exercises.length - 1) {
      document.querySelector(".next-btn").innerText = "Finish Workout 🔥";
    }
  } else {
    clearInterval(timerInterval);
    saveProgress();
    alert("Workout Complete! 🔥 You earned " + sessionPoints + " points!");
    window.history.back();
  }
}

function saveProgress() {
  let data = JSON.parse(localStorage.getItem("fitnessData")) || {
    points: 0, level: 1, streak: 0,
    workouts: 0, exercises: 0, minutes: 0,
    lastWorkoutDate: ""
  };
  data.points += sessionPoints;
  data.workouts += 1;
  data.exercises += exercises.length;
  data.minutes += Math.round((exercises.length * 30) / 60);
  data.level = Math.floor(data.points / 500) + 1;
  const today = new Date().toDateString();
  if (!data.lastWorkoutDate) {
    data.streak = 1;
  } else {
    const diff = (new Date(today) - new Date(data.lastWorkoutDate)) / (1000 * 60 * 60 * 24);
    if (diff === 1) data.streak += 1;
    else if (diff > 1) data.streak = 1;
  }
  data.lastWorkoutDate = today;
  localStorage.setItem("fitnessData", JSON.stringify(data));
}

function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  renderList();
  updateExercise();
});
