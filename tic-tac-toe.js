let currentPlayerSymbol = "x";
let squareValues = [];
squareValues.length = 9;


window.addEventListener("DOMContentLoaded", () => {
 let nextPlayer = false;

const grid = document.getElementById("tic-tac-toe-board");
grid.addEventListener("click", event => {
    if (event.target.id !== event.currentTarget.id) {
        const curSquare = event.target;

        let boxNum = event.target.id
        boxNum = boxNum[boxNum.length - 1]
        boxNum = Number.parseInt(boxNum);
        if (!squareValues[boxNum]) {
        let xo = document.createElement("img");
        if (!nextPlayer) {
            xo.setAttribute("src", "player-x.svg")
            curSquare.appendChild(xo)
        } else {
            xo.setAttribute("src", "player-o.svg")
            curSquare.appendChild(xo)
        }
        nextPlayer = !nextPlayer;

        }
    }

})


















})
