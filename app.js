var RootElem = document.querySelector(":root");
var GameElem = document.querySelector("#game");
var DinoElem = GameElem.querySelector(".dino");
var GroundElem = GameElem.querySelector(".ground");
var CactusElem = GameElem.querySelector(".cactus");
var ScoreElem = GameElem.querySelector(".score");

var GameSpeed = 4000; /* In MS: Decrease this to make game faster */
var JumpSpeed = 600; /* In MS: Decrease this to jump faster */
var MaxJump = 250;
var SpeedScale = 1; /* Speed increases gradually */
var Delta = 0;
var Score = 0;

var GameStarted = false;
var GameOver = false;

// Helper function - getCustomProperty
function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

// Helper function - setCustomProperty
function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

function onJump(e) {
  if (e.code !== "Space") return;
  handleJump();
}

function handleJump() {
  var audio = document.querySelector(".audio-jump");
  audio.play();
  DinoElem.classList.add("jump");
  DinoElem.addEventListener(
    "animationend",
    function () {
      DinoElem.classList.remove("jump");
    },
    false
  );
}

function startGame() {
  GameStarted = true;
  GameElem.classList.add("game-started");
  document.addEventListener("keydown", onJump);
  window.requestAnimationFrame(updateGame);
}

function endGame() {
  var audio = document.querySelector(".audio-die");
  audio.play();
  GameOver = true;
  GameElem.classList.add("game-over");
  document.removeEventListener("keydown", onJump);
}

function updateGame() {
  setCustomProperty(RootElem, "--game-speed", GameSpeed);
  setCustomProperty(RootElem, "--jump-speed", JumpSpeed);
  setCustomProperty(RootElem, "--max-jump", MaxJump);
  setCustomProperty(RootElem, "--speed-scale", SpeedScale);
  Score += 0.1;
  updateScore();
  updateCactus();
  if (checkGameOver()) {
    endGame();
    return;
  }
  window.requestAnimationFrame(updateGame);
}

function checkGameOver() {
  if (GameOver) return true;
  var dinoRect = DinoElem.getBoundingClientRect();
  var cactusRect = CactusElem.getBoundingClientRect();
  if (isCollision(dinoRect, cactusRect)) return true;
  return false;
}

function isCollision(dinoRect, cactusRect) {
  // AABB - Axis-aligned bounding box
  // How to solve this? https://stackoverflow.com/questions/39541744/how-to-detect-collisions-with-a-curve
  // Adjustments are made to the bounding box as there is a 1 pixel white border around the t-rex and obstacles.
  return (
    dinoRect.x < cactusRect.x + cactusRect.width &&
    dinoRect.x + dinoRect.width > cactusRect.x &&
    dinoRect.y < cactusRect.y + cactusRect.height &&
    dinoRect.y + dinoRect.height > cactusRect.y
  );
}

function updateScore() {
  var currentScore = parseInt(Score);
  if (currentScore === 0) return;

  //   For each 100 score mark, play the audio and increase the speed
  if (currentScore % 100 === 0) {
    var audio = document.querySelector(".audio-point");
    audio.play();
    GameSpeed -= SpeedScale;
    Delta += SpeedScale;
  }

  var currentScoreElem = ScoreElem.querySelector(".current-score");
  currentScoreElem.innerText = currentScore.toString().padStart(5, "0");
}

function updateCactus() {
  var isOffScreen = CactusElem.getBoundingClientRect().x > window.innerWidth;
  if (isOffScreen === false) return;
  var cacti = ["cactus-small-1", "cactus-small-2", "cactus-small-3"];
  var cactus = cacti[Math.floor(Math.random() * cacti.length)];
  CactusElem.classList.remove(
    "cactus-small-1",
    "cactus-small-2",
    "cactus-small-3"
  );
  CactusElem.classList.add(cactus);
}

function fitScreen() {
  console.log(window.devicePixelRatio);
  var width = window.innerWidth;
  var height = window.innerHeight / 2;
  GameElem.style.width = width + "px";
  GameElem.style.height = height + "px";
  GameElem.style.zoom = 1.5;
}

window.addEventListener("load", function () {
  fitScreen();
  window.addEventListener("resize", fitScreen);
  document.addEventListener("keydown", startGame, { once: true });
});
