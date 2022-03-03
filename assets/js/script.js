'use strict';
// Javascript code below influenced by "Build a Wordle Clone in Javascript HTML CSS" https://youtu.be/ckjRsPaWHX8

var height = 6; // number of guesses
var width = 5; // length of the word

var row = 0; // current guess (attempt #)
var col = 0; // current letter for that attempt

var gameOver = false; // rule for game over
var word = "QUEEN";

// Call function for page to load
window.onload = function () {
    initialize();
}

function initialize() {

    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            // <span id="0-0" class="title">S</span>
            const tile = document.createElement('span');
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add('tile');
            tile.innerText = '';
            document.querySelector('#board').appendChild(tile)
        }
    }
    // Process user input
    //Listen for keypress
    document.addEventListener('keyup', (e) => {
        if (gameOver) return;
        // Check to see if user pressed an alphabet key letter within dictionary order
        if ('KeyA' <= e.code && e.code <= 'KeyZ') {
            // Check to see if the column user is inputting letter into is less than 5
            if (col < width) {
                const currTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currTile.innerText === '') {
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        // If column user is currently on is between 0 and less than 5, backspace can be pressed
        else if (e.code === 'Backspace') {
            if (0 < col && col <= width) {
                col -= 1;
            }
            const currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = '';
        }
    })
}