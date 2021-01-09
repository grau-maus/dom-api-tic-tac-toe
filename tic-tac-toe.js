let squareValues = Array(9);
let gameStatus = '';
let announcementStatus = false;
let nightmareMode = false;
let nextPlayer = false;
let aiPlayer = '';

function checkGameStatus() {
    for (let j = 0; j < squareValues.length; j += 3) {
        if (squareValues[j] !== undefined && squareValues[j] === squareValues[j + 1] && squareValues[j] === squareValues[j + 2]) {
            gameStatus = squareValues[j];
            break;
        }
    }

    for (let i = 0; i < squareValues.length; i++) {
        if (squareValues[i] !== undefined && squareValues[i] === squareValues[i + 3] && squareValues[i] === squareValues[i + 6]) {
            gameStatus = squareValues[i];
            break;
        }
    }

    if (squareValues[0] !== '' && squareValues[0] === squareValues[4] && squareValues[0] === squareValues[8]) {
        gameStatus = squareValues[0];

    } else if (squareValues[2] !== '' && squareValues[2] === squareValues[4] && squareValues[2] === squareValues[6]) {
        gameStatus = squareValues[2];
    }

    if (gameStatus) {
        announcementStatus = true;
        document.getElementById("game-status").innerText = `Winner: ${gameStatus}`;

    } else {
        for (let i = 0; i < squareValues.length; i++) {
            if (!squareValues[i]) {
                return;
            }
        }
        announcementStatus = true;
        document.getElementById("game-status").innerText = `Tie!`;
    }
}

function aiMode() {
    if (nightmareMode && document.getElementById("give-up").disabled) {
        let min = Math.ceil(0);
        let max = Math.floor(1);
        let aiSymbol = Math.floor(Math.random() * (max - min + 1) + min);

        if (aiSymbol === 0) {
            aiPlayer = 'X';
        } else {
            aiPlayer = 'O';
        }

        if (aiPlayer === 'X') {
            let xo = document.createElement("img");
            let min = Math.ceil(0);
            let max = Math.floor(8);
            let randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
            let firstMove = document.getElementsByClassName("square");

            nextPlayer = true;
            xo.setAttribute("src", "player-x.svg");
            firstMove[randomIndex].appendChild(xo);
            squareValues[randomIndex] = 'X';
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let boardState = localStorage.getItem("boardState");
    let lastClicked = localStorage.getItem("latestSquare");
    let aiStatus = localStorage.getItem("aiStatus");
    let grid = document.getElementById("tic-tac-toe-board");
    let gridSquares = document.getElementsByClassName("square");
    let newGame = document.querySelectorAll("button")[0];
    let announcement = document.getElementById("game-status");
    let giveUp = document.querySelectorAll("button")[1];

    giveUp.setAttribute("id", "give-up");
    newGame.setAttribute("id", "new-game");
    newGame.disabled = true;
    giveUp.disabled = true;

    if (boardState || aiStatus) {
        giveUp.disabled = false;
        squareValues = JSON.parse(boardState);
        nightmareMode = JSON.parse(aiStatus);
        lastClicked = Number.parseInt(lastClicked);

        for (let i = 0; i < squareValues.length; i++) {
            if (squareValues[i]) {
                let xo = document.createElement("img");

                if (squareValues[i] === 'X') {
                    xo.setAttribute("src", "./player-x.svg");

                } else if (squareValues[i] === 'O') {
                    xo.setAttribute("src", "./player-o.svg");
                }

                gridSquares[i].appendChild(xo);
            }
        }

        if (squareValues[lastClicked] === 'X') {
            nextPlayer = true;
        }
    }

    aiMode();

    grid.addEventListener("click", event => {
        if (event.target.id !== event.currentTarget.id && !announcementStatus && event.target.id.startsWith("square")) {
            let curSquare = event.target;
            let boxNum = event.target.id;

            giveUp.disabled = false;
            boxNum = boxNum[boxNum.length - 1];
            boxNum = Number.parseInt(boxNum);

            if (nightmareMode && aiPlayer === 'X') {
                checkGameStatus();
            }

            if (!squareValues[boxNum] && !announcementStatus) {
                let xo = document.createElement("img");

                if (!nextPlayer) {
                    xo.setAttribute("src", "player-x.svg");
                    curSquare.appendChild(xo);
                    squareValues[boxNum] = 'X';

                } else if (nightmareMode && nextPlayer || !nightmareMode && nextPlayer) {
                    xo.setAttribute("src", "player-o.svg");
                    curSquare.appendChild(xo);
                    squareValues[boxNum] = 'O';
                }
                nextPlayer = !nextPlayer;

                checkGameStatus();

                if (nightmareMode && !announcementStatus) {
                    let xo = document.createElement("img");

                    while (curSquare.innerHTML) {
                        let min = Math.ceil(0);
                        let max = Math.floor(8);
                        let randomIndex = Math.floor(Math.random() * (max - min + 1) + min);

                        if (!gridSquares[randomIndex].innerHTML) {
                            curSquare = gridSquares[randomIndex];
                            boxNum = randomIndex;
                        }
                    }

                    if (aiPlayer === 'X' && !nextPlayer) {
                        xo.setAttribute("src", "player-x.svg");
                        curSquare.appendChild(xo);
                        squareValues[boxNum] = 'X';

                    } else if (aiPlayer === 'O') {
                        xo.setAttribute("src", "player-o.svg");
                        curSquare.appendChild(xo);
                        squareValues[boxNum] = 'O';
                    }
                    nextPlayer = !nextPlayer;
                }
                localStorage.setItem("latestSquare", boxNum);
            }
        }
        if (announcementStatus) {
            newGame.disabled = false;
            giveUp.disabled = true;
            nightmareMode = false;
        }

        localStorage.setItem("boardState", JSON.stringify(squareValues));
        // localStorage.setItem();
    });

    document.getElementsByClassName("actions")[0].addEventListener("click", event => {
        if (event.target.id === "new-game") {
            newGame.disabled = true;
            nextPlayer = false;
            announcementStatus = false;
            announcement.innerText = null;
            squareValues = Array(9);
            gameStatus = '';

            localStorage.clear();
            localStorage.setItem("aiStatus", "false");

            for (let i = 0; i < gridSquares.length; i++) {
                gridSquares[i].innerHTML = null;
            }

            let min = Math.ceil(0);
            let max = Math.floor(1);
            let aiChance = Math.floor(Math.random() * (max - min + 1) + min);
            let compare = Math.floor(Math.random() * (max - min + 1) + min);

            if (aiChance === compare) {
                nightmareMode = true;
                localStorage.setItem("aiStatus", "true");
            }
            aiMode();

        } else if (event.target.id === "give-up") {
            newGame.disabled = false;
            giveUp.disabled = true;
            announcementStatus = true;

            if (nextPlayer) {
                announcement.innerText = "Winner: X";

            } else {
                announcement.innerText = "Winner: O";
            }
        }
    });
})
