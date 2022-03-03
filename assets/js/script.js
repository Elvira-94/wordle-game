'use strict';
// Javascript code below influenced by "Build a Wordle Clone in Javascript HTML CSS" tutorial https://youtu.be/ckjRsPaWHX8
// And "Build a Wordle Clone in Javascript HTML CSS Part 2" tutorial https://youtu.be/MM9FAV_CEkU

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
    let letterCount = {}; //KENNY _ > {K:1, E:1, N:2, Y:1}
    for (let i = 0; i < word.length; i++) { // fill our guess map
        let letter = word[i];
        if (letterCount[letter]) { // if the letter is in the guess map, add 1
            letterCount[letter] += 1;
        } else { // otherwise we set it to 1
            letterCount[letter] = 1;
        }
    }
    // Let's iterate the guess word twice
    // The first time we are going to check if the letters
    // in the guess map are in the correct position and update accordingly
    // The second time we iterate, we are going to check to see if there are letters that are not in the correct position 
    //and we are going to use the guess map that 
    // we've updated to make sure we don't get any duplicates


    // first iteration, check all the correct ones
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is the letter in the correct position in the word?
        if (word[c] == letter) {
            currTile.classList.add('correct');
            correct += 1;
            letterCount[letter] -= 1;
        }
        // Another way for gameover if user guesses word correctly
        if (correct == width) {
            gameOver = true;
        }
    }
    // Go again and mark which ones are present but in the wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains('correct')) {
            // Is the letter in the word but in the wrong place?
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add('inWord');
                letterCount[letter] -= 1;
            } // The letter is not in the word
            else {
                currTile.classList.add('notInWord');
            }
        }
    }
}