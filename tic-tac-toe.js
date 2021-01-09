//DOM API-nnnnnnnnnnnnnnnnnn-
let xIMG;
let oIMG;
let divGame;
let h1GameStatus;
let divGridArray;
let btnNewGame;
let btnGiveUp;
//DOM API-uuuuuuuuuuuuuuuuuu-

//BOOLEAN-nnnnnnnnnnnnnnnnnn-
let secondPlayer;
let aiStatusOn;
//BOOLEAN-uuuuuuuuuuuuuuuuuu-

//ARRAY-nnnnnnnnnnnnnnnnnnnn-
let squareArray;
//ARRAY-uuuuuuuuuuuuuuuuuuuu-

//IMMUTABLE-nnnnnnnnnnnnnnnn-
let aiXO;
//IMMUTABLE-uuuuuuuuuuuuuuuu-

//this function is also called when the page is reloaded with nothing
function newGame() {
    loadAPI();

    //BOOLEAN-nnnnnnnnnnnnnnnnnn-
    secondPlayer = false;
    aiStatusOn = false;
    //BOOLEAN-uuuuuuuuuuuuuuuuuu-

    //ARRAY-nnnnnnnnnnnnnnnnnnnn-
    squareArray = Array(9);
    //ARRAY-uuuuuuuuuuuuuuuuuuuu-

    //reset variables and html elements
    aiXO = null;
    h1GameStatus.innerText = null;
    btnNewGame.disabled = true;
    btnGiveUp.disabled = false;

    //clear the local storage
    localStorage.clear();

    //clear the array holding the 'X / O' characters
    for (let i = 0; i < divGridArray.length; i++) {
        divGridArray[i].innerHTML = null;
    }

    //random function to determine if the next new game will be against an AI
    random(btnNewGame.id);

    //if ai mode is turned on from previous function AND ai's symbol is 'X', proceed with the first move
    if (aiStatusOn && aiXO === 'X') {
        aiMove();
    }
}

//this function checks to make sure we're clicking on the correct html elements
function parseInput(event) {

    //a condition to make sure we're clicking on elements that have an id that starts with "square"
    //also prevents players from adding more symbols to the grid if the game already has a winner
    //ALSO prevents changing a symbol within the element if it was previously filled
    if ((event.target.id.startsWith("square") && !event.target.innerHTML && !h1GameStatus.innerText) && (aiStatusOn || !aiStatusOn)) {
        //get the last character of the element's id and parse it to a non-string value
        const squareValue = Number.parseInt(event.target.id[event.target.id.length - 1]);

        //update the array holding the symbols AND the grid elements
        gameUpdate(squareValue);

        //for when ai mode is true and are the second player
        if (aiStatusOn && aiXO === 'O' && !h1GameStatus.innerText) {
            aiMove();
        } else if (aiStatusOn && aiXO === 'X' && !h1GameStatus.innerText) {     //<=== this is for if the ai is the first player, the ai's first move happens in newGame()
            aiMove();                                                               //then wait for the player's input, then proceed again with ai's move
        }
    } else if (event.target.id === "new-game") {
        newGame();

    } else if (event.target.id === "give-up") {
        saveState();
        giveUp();
    }
}

//announce the winner and enable / disable the appropriate buttons
function announceWinner(symbol) {
    if (symbol === "Tie!") {
        h1GameStatus.innerText = symbol;
    } else {
        h1GameStatus.innerText = `Winner: ${symbol}`
    }

    btnNewGame.disabled = false;
    btnGiveUp.disabled = true;
}

//assign a character to a specific index in our squareArray and also place an image within the grid
//that corresponds to the current player
function drawXO(gridValue) {
    if (!secondPlayer) {
        squareArray[gridValue] = 'X';
        divGridArray[gridValue].innerHTML = xIMG;
    } else {
        squareArray[gridValue] = 'O';
        divGridArray[gridValue].innerHTML = oIMG;
    }
}

//to update the game state, checking for winners
function gameUpdate(playerValue) {
    //since the '0' value is falsey, let's make an explicit condition to take care of that
    if (playerValue === 0 || playerValue) {
        drawXO(playerValue);
    }

    //check for any matches horizontally
    for (let i = 0; i < squareArray.length; i += 3) {
        if ((squareArray[i] !== null && squareArray[i] !== undefined) && (squareArray[i] === squareArray[i + 1] && squareArray[i] === squareArray[i + 2])) {
            announceWinner(squareArray[i]);
            break;
        }
    }

    //check for any matches vertically
    for (let i = 0; i < squareArray.length; i++) {
        if ((squareArray[i] !== null && squareArray[i] !== undefined) && (squareArray[i] === squareArray[i + 3] && squareArray[i] === squareArray[i + 6])) {
            announceWinner(squareArray[i]);
            break;
        }
    }

    //check for any matches diagonally
    if ((squareArray[0] !== null && squareArray[0] !== undefined) && (squareArray[0] === squareArray[4] && squareArray[0] === squareArray[8])) {
        announceWinner(squareArray[0]);

    } else if ((squareArray[2] !== null && squareArray[2] !== undefined) && (squareArray[2] === squareArray[4] && squareArray[2] === squareArray[6])) {
        announceWinner(squareArray[2]);
    }

    //if there is an announced WINNER just exit out of this function
    if (h1GameStatus.innerText) {
        return;
    } else {                    //<=== otherwise, let's check if all the arrays are filled
        let filledSquares = 0;

        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i]) {
                filledSquares++;
            }
        }

        //if all of the arrays are filled with no clear winner, then announce a TIE
        if (filledSquares === squareArray.length) {
            announceWinner("Tie!");
            gameUpdate();
        }
    }

    //switch players after updating game state
    secondPlayer = !secondPlayer;
}

function giveUp() {
    if (secondPlayer) {
        announceWinner("X");
    } else {
        announceWinner("O");
    }

    btnNewGame.disabled = false;
    btnGiveUp.disabled = true;
}

function aiMove() {
    let ranValue = random();

    //if the element at the given random index (0 - 8) contains something, call the function itself again to regenerate a new random value
    if (squareArray[ranValue]) {
        aiMove();
    } else {                    //<=== if it DOESN'T contain anything, then proceed to update the game state with a random pick from the ai
        gameUpdate(ranValue);
    }
}

function random(context) {
    let min = Math.ceil(0);
    let max;

    //if the new game button is clicked
    if (context === btnNewGame.id) {
        max = Math.floor(9);

        //compare two values, and if they match, turn ai mode on
        if (Math.floor(Math.random() * (max - min + 1) + min) === Math.floor(Math.random() * (max - min + 1) + min)) {
            aiStatusOn = true;
        }

        //if ai mode IS turned ON, then assign it either 'X' or 'O' randomly
        if (aiStatusOn) {
            max = Math.floor(1);

            if (Math.floor(Math.random() * (max - min + 1) + min) === 0) {
                aiXO = 'O';
            } else {
                aiXO = 'X';
            }
        }
    } else if (!context) {              //<=== if the new game button is NOT clicked, just generate a random value from 0 - 8
        max = Math.floor(8);

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

function saveState() {
    localStorage.setItem("squareArray", JSON.stringify(squareArray));
    localStorage.setItem("secondPlayer", JSON.stringify(secondPlayer));
    localStorage.setItem("h1GameStatus", h1GameStatus.innerText);
    localStorage.setItem("aiStatusOn", JSON.stringify(aiStatusOn));
    localStorage.setItem("aiXO", JSON.stringify(aiXO));
    localStorage.setItem("btnNewGame", JSON.stringify(btnNewGame.disabled));
    localStorage.setItem("btnGiveUp", JSON.stringify(btnGiveUp.disabled));
}

function loadState() {
    squareArray = JSON.parse(localStorage.getItem("squareArray"));
    secondPlayer = JSON.parse(localStorage.getItem("secondPlayer"));
    h1GameStatus.innerText = localStorage.getItem("h1GameStatus");
    aiStatusOn = JSON.parse(localStorage.getItem("aiStatusOn"));
    aiXO = JSON.parse(localStorage.getItem("aiXO"));
    btnNewGame.disabled = JSON.parse(localStorage.getItem("btnNewGame"));
    btnGiveUp.disabled = JSON.parse(localStorage.getItem("btnGiveUp"));

    //if the page is reloaded, let's check if the array has something in it
    //if it does, just exit out and keep all the assignments from above
    for (let i = 0; i < squareArray.length; i++) {
        if (squareArray[i]) {
            return;
        }
    }

    //if the array is filled with NOTHING, BUT there was an announcement of a winner (from giving up at the very start)
    //just keep everything from above and don't start a new game
    if (h1GameStatus.innerText) {
        return;
    }

    //otherwise, if there is NO announcement and NOTHING in the array, then proceed with a new game
    newGame();
}

//function call to assign variables to specific parts of the DOM
//only called during a page reload
function loadAPI() {
    xIMG = '<img src="./xo/player-x.svg">';
    oIMG = '<img src="./xo/player-o.svg">';
    divGame = document.querySelector("#game");
    divGridArray = document.querySelectorAll(".square");
    h1GameStatus = document.querySelector("#game-status");
    btnNewGame = document.querySelectorAll("button")[0];
    btnGiveUp = document.querySelectorAll("button")[1];
    btnNewGame.setAttribute("id", "new-game");
    btnGiveUp.setAttribute("id", "give-up");
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("secondPlayer")) {
        loadAPI();
        loadState();
    } else {
        newGame();
    }

    document.addEventListener("click", event => {
        parseInput(event);
        saveState();
    });
});
