function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Helper function - getCustomProperty
function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

// Helper function - setCustomProperty
function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value);
}

// Config
var GameElem;
var GameSpeed = 1;
var SpeedScale = 0.01;
var StartTimestamp = 0;
var PreviousTimestamp = 0;
var GameStarted = false;
var GameOver = false;
var score = 0;

// Game functions - Start
function updateGame(timestamp) {
  if (!StartTimestamp) StartTimestamp = timestamp;
  var delta = timestamp - PreviousTimestamp;
  score = parseInt(timestamp / 100);

  updateDino(delta);
  updateGround(delta);
  updateClouds(delta);
  updateCacti(delta);
  updateScore(score);

  if (checkGameOver()) {
    endGame();

    return;
  }

  PreviousTimestamp = timestamp; // In ms
  window.requestAnimationFrame(updateGame);
}

function isCollision(dinoRect, cactusRect) {
  // AABB - Axis-aligned bounding box
  // How to solve this? https://stackoverflow.com/questions/39541744/how-to-detect-collisions-with-a-curve
  // Adjustments are made to the bounding box as there is a 1 pixel white
  // border around the t-rex and obstacles.
  return (
    dinoRect.x < cactusRect.x + cactusRect.width &&
    dinoRect.x + dinoRect.width > cactusRect.x &&
    dinoRect.y < cactusRect.y + cactusRect.height &&
    dinoRect.y + dinoRect.height > cactusRect.y
  );
}

function checkGameOver() {
  var dinoElem = document.querySelector(".dino");
  var dinoRect = dinoElem.getBoundingClientRect();
  var cactiElem = document.querySelectorAll(".cactus");
  var cactiRect = Array.from(cactiElem).map((cactusElem) =>
    cactusElem.getBoundingClientRect()
  );

  // Is there collision?
  return cactiRect.some((cactusRect) => isCollision(dinoRect, cactusRect));
}

function setScores() {
  if (!GameStarted) return;
  var highscore = localStorage.getItem("highscore");
  highscore = parseInt(highscore);
  if (!highscore) highscore = 0;

  var highScoreElem = document.querySelector(".high-score");
  highScoreElem.textContent = "HI" + highscore.toString().padStart(5, "0");

  var currentScoreElem = document.querySelector(".current-score");
  currentScoreElem.textContent = score.toString().padStart(5, "0");
}

function checkNewHighScore() {
  if (!GameOver) return;
  var highscore = localStorage.getItem("highscore");
  highscore = parseInt(highscore);
  if (!highscore) highscore = 0;
  if (score > highscore) {
    // new high score
    localStorage.setItem("highscore", score);
  }
  var highScoreElem = document.querySelector(".high-score");
  highScoreElem.textContent = "HI" + score.toString().padStart(5, "0");
}

function updateScore() {
  // Display score
  var currentScoreElem = document.querySelector(".current-score");
  currentScoreElem.textContent = score.toString().padStart(5, "0");

  //   For each 100 score mark, play the audio and increase the speed
  if (score % 100 === 0) {
    var audio = document.querySelector(".audio-point");
    audio.play();

    GameSpeed += SpeedScale;
  }
}

function startGame() {
  GameStarted = true;
  GameOver = false;
  setScores();
  GameElem = document.querySelector("#game");

  if (isTouchDevice()) {
  }
  document.addEventListener("keydown", onJump);
  window.requestAnimationFrame(updateGame);
}

function endGame() {
  GameOver = true;
  GameStarted = false;
  var audio = document.querySelector(".audio-die");
  audio.play();
  checkNewHighScore();
  document.removeEventListener("keydown", onJump);
}
// Game functions - End

// Dino functions - Start
var dinoRunInterval = 100; // In ms
var dinoLastFrameTime = dinoRunInterval;
var dinoStartFromRight = true;
function runDino(delta) {
  var timestamp = PreviousTimestamp - delta;
  if (timestamp >= dinoLastFrameTime) {
    dinoLastFrameTime += dinoRunInterval;
    var dinoElem = document.querySelector(".dino");
    if (dinoStartFromRight) {
      dinoElem.src = "./assets/images/dino/dino_run_right.png";
    } else {
      dinoElem.src = "./assets/images/dino/dino_run_left.png";
    }
    dinoStartFromRight = !dinoStartFromRight;
  }
}

var jumping = false;
var jumpup = false;
var jumpdown = false;
var maxJump = 70;
var jumpSpeed = 4 + GameSpeed / 1000;
function onJump(e) {
  if (jumping || jumpup || jumpdown) return;
  if (e.code !== "Space") return;
  var audio = document.querySelector(".audio-jump");
  audio.play();
  jumping = true;
  jumpup = true;
  handleJump();
}

function handleJump() {
  var dinoElem = document.querySelector(".dino");
  if (jumpup) {
    setCustomProperty(
      dinoElem,
      "--bottom",
      getCustomProperty(dinoElem, "--bottom") + jumpSpeed
    );
    if (getCustomProperty(dinoElem, "--bottom") >= maxJump) {
      jumpup = false;
      jumpdown = true;
    }
  }

  if (jumpdown) {
    setCustomProperty(
      dinoElem,
      "--bottom",
      getCustomProperty(dinoElem, "--bottom") - jumpSpeed
    );
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
      jumpup = false;
      jumpdown = false;
      jumping = false;
    }
  }
}

function updateDino(delta) {
  runDino(delta);
  handleJump(delta);
}
// Dino functions - End

// Ground functions - Start
function moveGround() {
  var groundElem = document.querySelector(".ground");
  setCustomProperty(
    groundElem,
    "--left",
    getCustomProperty(groundElem, "--left") - GameSpeed
  );

  var reserveGroundElem = document.querySelector(".ground-reserve");
  setCustomProperty(
    reserveGroundElem,
    "--left",
    getCustomProperty(reserveGroundElem, "--left") - GameSpeed
  );

  // Reset position
  if (getCustomProperty(groundElem, "--left") <= -300) {
    setCustomProperty(groundElem, "--left", 0);
    setCustomProperty(reserveGroundElem, "--left", 300);
  }
}

function updateGround(delta) {
  moveGround();
}
// Ground functions - End

// Cloud functions - Start
function createCloud() {
  var minCloudTopOffset = 20;
  var maxCloudTopOffset = 50;
  var topOffset =
    Math.floor(Math.random() * maxCloudTopOffset) + minCloudTopOffset;
  var cloudElem = document.createElement("img");
  cloudElem.src = "./assets/images/cloud.png";
  cloudElem.classList.add("cloud");
  setCustomProperty(cloudElem, "--left", 100);
  setCustomProperty(cloudElem, "--top", topOffset);
  GameElem.append(cloudElem);
}

var minCloudInterval = 1000; // minimun cloud interval in ms
var maxCloudInterval = 5000; // maximum cloud interval in ms
var nextCloudInterval = 0; // next cloud interval in ms
function moveClouds() {
  var cloudsElem = document.querySelectorAll(".cloud");
  cloudsElem.forEach((cloudElem) => {
    setCustomProperty(
      cloudElem,
      "--left",
      getCustomProperty(cloudElem, "--left") - GameSpeed / 10
    );

    // Remove unnecessary cloud
    if (getCustomProperty(cloudElem, "--left") <= -100) {
      cloudElem.remove();
    }
  });

  if (nextCloudInterval <= 0) {
    createCloud();
    nextCloudInterval =
      Math.floor(Math.random() * maxCloudInterval) + minCloudInterval;
  }

  nextCloudInterval -= GameSpeed;
}
function updateClouds(delta) {
  moveClouds();
}
// Cloud functions - End

// Cactus functions - Start
function createCactus() {
  var cacti = [
    // "cacti_group.png",
    "cacti_large_1.png",
    "cacti_large_2.png",
    "cacti_small_1.png",
    "cacti_small_2.png",
    "cacti_small_3.png",
  ];
  var randomCactus = Math.floor(Math.random() * (cacti.length - 1));
  var cactusElem = document.createElement("img");
  cactusElem.src = "./assets/images/cacti/" + cacti[randomCactus];
  cactusElem.classList.add("cactus");
  setCustomProperty(cactusElem, "--left", 100);
  GameElem.append(cactusElem);
}

var minCactusInterval = 60; // minimun cactus interval in ms
var maxCactusInterval = 100; // maximum cactus interval in ms
var nextCactusInterval = minCactusInterval; // next cactus interval
function moveCacti() {
  var cactiElem = document.querySelectorAll(".cactus");
  cactiElem.forEach((cactusElem) => {
    setCustomProperty(
      cactusElem,
      "--left",
      getCustomProperty(cactusElem, "--left") - GameSpeed
    );

    // Remove cacti that have been jumped
    if (getCustomProperty(cactusElem, "--left") <= -100) {
      cactusElem.remove();
    }
  });

  if (nextCactusInterval <= 0) {
    createCactus();
    nextCactusInterval =
      Math.floor(Math.random() * maxCactusInterval) + minCactusInterval;
  }

  nextCactusInterval -= GameSpeed;
}

function updateCacti(delta) {
  moveCacti();
}
// Cactus functions - End

window.onload = () => {
  var width = window.innerWidth;
  var height = window.innerHeight / 2;
  var elem = document.querySelector("#game");
  elem.style.width = width + "px";
  elem.style.height = height + "px";
  startGame();
};
