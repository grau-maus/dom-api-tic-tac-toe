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

function newGame() {
    //DOM API-nnnnnnnnnnnnnnnnnn-
    xIMG = '<img src="./xo/player-x.svg">';
    oIMG = '<img src="./xo/player-o.svg">';
    divGame = document.querySelector("#game");
    divGridArray = document.querySelectorAll(".square");
    h1GameStatus = document.querySelector("#game-status");
    btnNewGame = document.querySelectorAll("button")[0];
    btnGiveUp = document.querySelectorAll("button")[1];
    btnNewGame.setAttribute("id", "new-game");
    btnGiveUp.setAttribute("id", "give-up");
    //DOM API-uuuuuuuuuuuuuuuuuu-

    //BOOLEAN-nnnnnnnnnnnnnnnnnn-
    secondPlayer = false;
    aiStatusOn = false;
    //BOOLEAN-uuuuuuuuuuuuuuuuuu-

    //ARRAY-nnnnnnnnnnnnnnnnnnnn-
    squareArray = Array(9);
    //ARRAY-uuuuuuuuuuuuuuuuuuuu-

    h1GameStatus.innerText = null;
    btnNewGame.disabled = true;
    btnGiveUp.disabled = false;
    localStorage.clear();

    for (let i = 0; i < divGridArray.length; i++) {
        divGridArray[i].innerHTML = null;
    }
}

function parseInput(event) {
    if (aiStatusOn && aiXO === 'X' && !h1GameStatus.innerText) {
        aiMove();
        gameUpdate();
    }

    if (event.target.id.startsWith("square") && !event.target.innerHTML && !h1GameStatus.innerText) {
        const squareValue = Number.parseInt(event.target.id[event.target.id.length - 1]);

        if (!secondPlayer) {
            event.target.innerHTML = xIMG;

        } else {
            event.target.innerHTML = oIMG;
        }
        gameUpdate(squareValue);

    } else if (event.target.id === "new-game") {
        newGame();

    } else if (event.target.id === "give-up") {
        giveUp();
    }

    if (aiStatusOn && aiXO === 'O' && !h1GameStatus.innerText) {
        aiMove();
        gameUpdate();
    }
}

function drawXO(gridValue) {
    if (!secondPlayer) {
        squareArray[gridValue] = 'X';
    } else {
        squareArray[gridValue] = 'O';
    }
}

function announceWinner(symbol) {
    if (symbol === "Tie!") {
        h1GameStatus.innerText = symbol;
    } else {
        h1GameStatus.innerText = `Winner: ${symbol}`
    }

    btnNewGame.disabled = false;
    btnGiveUp.disabled = true;
}

function gameUpdate(playerValue) {
    if (playerValue) {
        drawXO(playerValue);
    }

    for (let i = 0; i < squareArray.length; i += 3) {
        if (squareArray[i] !== undefined && squareArray[i] === squareArray[i + 1] && squareArray[i] === squareArray[i + 2]) {
            announceWinner(squareArray[i]);
            break;
        }
    }

    for (let i = 0; i < squareArray.length; i++) {
        if (squareArray[i] !== undefined && squareArray[i] === squareArray[i + 3] && squareArray[i] === squareArray[i + 6]) {
            announceWinner(squareArray[i]);
            break;
        }
    }

    if (squareArray[0] !== undefined && squareArray[0] === squareArray[4] && squareArray[0] === squareArray[8]) {
        announceWinner(squareArray[0]);

    } else if (squareArray[2] !== undefined && squareArray[2] === squareArray[4] && squareArray[2] === squareArray[6]) {
        announceWinner(squareArray[2]);
    }

    if (h1GameStatus.innerText) {
        return;
    } else {
        let filledSquares = 1;

        for (let i = 0; i < squareArray.length; i++) {
            if (squareArray[i]) {
                filledSquares++;
            }
        }

        if (filledSquares === squareArray.length) {
            announceWinner("Tie!");
            gameUpdate();
        }
    }

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

}

function saveState() {
    localStorage.setItem("squareArray", JSON.stringify(squareArray));
    localStorage.setItem("secondPlayer", JSON.stringify(secondPlayer));
    localStorage.setItem("h1GameStatus", JSON.stringify(h1GameStatus));
    localStorage.setItem("aiStatusOn", JSON.stringify(aiStatusOn));
    localStorage.setItem("aiXO", JSON.stringify(aiXO));
}

function loadState() {
    squareArray = JSON.parse(localStorage.getItem("squareArray"));
    secondPlayer = JSON.parse(localStorage.getItem("secondPlayer"));
    h1GameStatus = JSON.parse(localStorage.getItem("h1GameStatus"));
    aiStatusOn = JSON.parse(localStorage.getItem("aiStatusOn"));
    aiXO = JSON.parse(localStorage.getItem("aiXO"));
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("secondPlayer")) {
        loadState();
    } else {
        newGame();
    }

    document.addEventListener("click", event => {
        parseInput(event);
        saveState();
    });
});
