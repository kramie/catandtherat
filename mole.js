let currMoleTile;
let currPlantTiles = []; // Array to keep track of plant tiles
let score = 0;
let gameOver = false;
let lives = 3; // Initialize lives

window.onload = function() {
    document.getElementById("startGame").addEventListener("click", startGame);
    document.getElementById("tryAgain").addEventListener("click", restartGame);
}

function startGame() {
    setGame();
    // Start background music on button click
    let backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.volume = 0.1; // Set volume (0.0 to 1.0)
    backgroundMusic.play().catch(e => {
        console.log("Autoplay blocked. User interaction required.");
    });

    // Hide the "Try Again" button and show the "Start Game" button
    document.getElementById("tryAgain").style.display = "none";
    document.getElementById("startGame").style.display = "none";

    // Reset lives
    lives = 3;
    updateLivesDisplay();
}

function restartGame() {
    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score.toString(); // Reset score

    // Stop game over sound and reset playback position
    let gameOverSound = document.getElementById("gameOverSound");
    gameOverSound.pause();
    gameOverSound.currentTime = 0; // Reset playback position to start

    // Reset the game board
    document.getElementById("board").innerHTML = "";

    // Restart the game
    startGame();
}

function setGame() {
    // Set up the grid for the game board in HTML
    for (let i = 0; i < 9; i++) { // i goes from 0 to 8
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 2000); // 2000 milliseconds = 2 seconds
    setInterval(setPlant, 2000); // 2000 milliseconds = 2 seconds
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) {
        return;
    }

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    
    let mole = document.createElement('img');
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTiles.some(tile => tile.id == num)) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }

    // Clear existing plant tiles
    currPlantTiles.forEach(tile => tile.innerHTML = "");
    currPlantTiles = [];

    // Add seven plant tiles
    while (currPlantTiles.length < 7) {
        let num = getRandomTile();
        if (currMoleTile && currMoleTile.id == num) {
            continue;
        }
        let plantTile = document.getElementById(num);
        if (!currPlantTiles.includes(plantTile)) {
            let plant = document.createElement("img");
            plant.src = "./piranha-plant.png";
            plantTile.appendChild(plant);
            currPlantTiles.push(plantTile);
        }
    }
}

function selectTile() {
    if (gameOver) {
        return;
    }
    
    let plantClickSound = document.getElementById("plantClickSound");
    let gameOverSound = document.getElementById("gameOverSound");

    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = score.toString(); // Update score
    }
    else if (currPlantTiles.includes(this)) {
        // Deduct a life
        lives--;
        updateLivesDisplay();
        
        if (lives <= 0) {
            document.getElementById("score").innerText = "Game Over: " + score.toString();
            gameOver = true;
            gameOverSound.play(); // Play game over sound

            // Stop background music
            let backgroundMusic = document.getElementById("backgroundMusic");
            backgroundMusic.pause();

            // Show the "Try Again" button and hide the "Start Game" button
            document.getElementById("tryAgain").style.display = "block";
            document.getElementById("startGame").style.display = "none";
        }
        else {
            // Play plant click sound
            plantClickSound.play();
        }
    }
}

function updateLivesDisplay() {
    // Update the lives display (You might want to add a dedicated element for this)
    document.getElementById("score").innerText = `Score: ${score} | Lives: ${lives}`;
}
