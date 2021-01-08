let squareValues = [];
squareValues.length = 9;
let gameStatus = '';
let announcementStatus= false;

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
        let announcement = document.getElementById("game-status");
        announcementStatus = true;
        announcement.innerText = `Winner: ${gameStatus}`;
    } else {
        for (let i = 0; i < squareValues.length; i++) {
            if (!squareValues[i]) {
                return;
            }
        }

        let announcement = document.getElementById("game-status");
         announcementStatus = true;
        announcement.innerText = `Tie!`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let nextPlayer = false;
    const grid = document.getElementById("tic-tac-toe-board");
    let newGame = document.querySelectorAll("button");
    newGame[0].setAttribute("id", "new-game")

    grid.addEventListener("click", event => {
        if (event.target.id !== event.currentTarget.id) {
            const curSquare = event.target;
            let boxNum = event.target.id;

            boxNum = boxNum[boxNum.length - 1];
            boxNum = Number.parseInt(boxNum);

            if (!squareValues[boxNum]) {
                let xo = document.createElement("img");

                if (!nextPlayer) {
                    xo.setAttribute("src", "player-x.svg");
                    curSquare.appendChild(xo);
                    squareValues[boxNum] = 'X';
                } else {
                    xo.setAttribute("src", "player-o.svg");
                    curSquare.appendChild(xo);
                    squareValues[boxNum] = 'O';
                }
                nextPlayer = !nextPlayer;
            }
        }

        checkGameStatus();
    })
   newGame[0].addEventListener("click", event => {
    if (announcementStatus) {
        newGame[0].disabled = false;
    } else {
        newGame[0].disabled = true;
    }
   })

})
