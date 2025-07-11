// Board settings
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


// Bird starting settings
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let animationFrames = 4;
let animationIndex = 0;
let birdAnimation = [];


// Bird Class
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}


// Pipes Settings
let pipes = [];
// Scaled to 1/8. Width/Height ratio: 384/3072
let pipeWidth = 64;
let pipeHeight = 512;
// Pipes starting location
let pipeX = boardWidth;
let pipeY = 0;
// Top and Bot pipes
let topPipeImg;
let botPipeImg;


//  Physics
// Speed of pipes moving -> To the left
let velocityX = -2;
// Gravity of the game
let gravity = 0.4;
// Bird jumping velocity
let velocityY = 0;

// Game state
let start = false;
let gameOver = false;
let score = 0;


// Load window
window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    let homeScreen = document.getElementById("homeScreen");
    let startButton = document.getElementById("start");

    initGame();

    startButton.addEventListener("click", function () {
        homeScreen.style.display = "none";
        board.style.display = "block";
        start = true;

        // Start game loops
        requestAnimationFrame(update);
        setInterval(createPipes, 1500);
        setInterval(animateBird, 100);
    });
}

function initGame() {
    // Upload bird animation information
    for (let i = 0; i < animationFrames; i++) {
        birdImg = new Image();
        birdImg.src = `./sources/flappybird${i}.png`;
        birdAnimation.push(birdImg);
    }

    topPipeImg = new Image();
    topPipeImg.src = `./sources/toppipe.png`;
    botPipeImg = new Image();
    botPipeImg.src = `./sources/bottompipe.png`;

    document.addEventListener("keydown", moveBird);
    board.addEventListener("click", moveBird);
}


// Update frames function
function update() {
    requestAnimationFrame(update);
    // Check game State
    if (!start || gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Draw Bird - Animated
    // Add gravity in each frame
    velocityY += gravity;
    // Define the top of the screen as a limit
    bird.y = Math.max(bird.y + velocityY, 0);
    // Draw current frame
    context.drawImage(birdAnimation[animationIndex], bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Draw Pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        // Move the pipe to the left
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Detected passed
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        // Detect pipe collision
        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    // Clear passedPipes to avoid memory overflow
    while (pipes.length > 0 && pipes[0].x < -pipeWidth){
        // Removes the first element of the pipes array
        pipes.shift()
    }

    // Draw Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, board.width-36,45);

    // Game Over Text
    if (gameOver) {
        context.fillText("GAME OVER", board.width/8,board.height/2);
    }
}


// Create pipes function
function createPipes() {
    // Check game state
    if (gameOver) {
        return;
    }
    // Randomize pipes heigh
    let randomPipeY = pipeY - (pipeHeight / 4) - (Math.random() * (pipeHeight / 2));

    // Define the opening between pipes
    let openingSpace = boardHeight/4;

    // Top pipe object
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    // Add the pipe to the array of pipes
    pipes.push(topPipe);

    // Bottom pipe object
    let botPipe = {
        img: botPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    // Add the pipe to the array of pipes
    pipes.push(botPipe);
}


// Animate bird function
function animateBird() {
    // Change the animation index and guarantee it is within animation range
    animationIndex++;
    animationIndex %= animationFrames;
}

/**
 * Function that handles the jumping logic
 * @param e - The key pressed by the user
 */
function moveBird(e) {
    // Check which key was pressed
    if (e.code === "Space" || e.code === "ArrowUp") {
        // Jump -> Adds 6px to the vertical velocity of the bird
        velocityY = -6;
    } else if (e.type === "click"){
        velocityY = -6;
    }

    // Reset the game
    if (gameOver) {
        resetGame()
    }
}

// Detect collision between bird and pipes
function detectCollision(bird, pipe) {
    return bird.x < pipe.x + pipe.width
        && bird.x + bird.width > pipe.x
        && bird.y < pipe.y + pipe.height
        && bird.y + bird.height > pipe.y;
}

// Display the gameOver Screen
function resetGame() {
    bird.y = birdY;
    pipes = [];
    score = 0;
    gameOver = false;
}



