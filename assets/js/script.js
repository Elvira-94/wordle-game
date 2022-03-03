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
            let tile = document.createElement('span');
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add('tile');
            tile.innerText = '';
            document.querySelector('#board').appendChild(tile);
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
                let currTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currTile.innerText == '') {
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        // If column user is currently on is between 0 and less than 5, backspace can be pressed
        else if (e.code == 'Backspace') {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = '';
        }
        // Function to pull up udate an increment the row by 1
        else if (e.code == 'Enter') {
            update();
            row += 1; // Start new row
            col = 0; // Start at 0 for new row
        }
        // If row is equal to height, the user has used up all their attempts
        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById('answer').innerText = word;
        }
    })
}

// Function to call update below
function update() { // iterate all the letters of the word that the user guessed
    let correct = 0;
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position in the word?
        if (word[c] == letter) {
            currTile.classList.add('correct');
            correct += 1;
        } // Is it in the word but in the wrong place?
        else if (word.includes(letter)) {
            currTile.classList.add('inWord');
        } // Not in the word
        else {
            currTile.classList.add('notInWord');
        }
        // Another way for gameover if user guesses word correctly
        if (correct == width) {
            gameOver = true;
        }
    }
}