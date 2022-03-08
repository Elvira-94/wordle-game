// Javascript code below influenced by "Build a Wordle Clone in Javascript HTML CSS" tutorial https://youtu.be/ckjRsPaWHX8
// And "Build a Wordle Clone in Javascript HTML CSS Part 2" tutorial https://youtu.be/MM9FAV_CEkU
import {
    wordList
} from "./possible-words.js";

const maxGuesses = 10;
const minGuesses = 1;
const maxWordLength = 7;
const minWordLength = 3;
let guessCount = 6;
let wordLength = 5;
let row = 0;
let col = 0;
let gameOver = false;
let word = '';

Swal.bindClickHandler();
Swal.mixin({
    toast: false,
    didClose: (toast) => {
        document.activeElement.blur();
    }
}).bindClickHandler('data-swal-template');

function showInstructions() {
    Swal.fire({
        template: '#game-instructions'
    });
}

function showSettings() {
    // SweetAlert2 Multiple Inputs not suported so this is their recommended method:
    // https://sweetalert2.github.io/#input-types
    (async () => {
        const {
            value: formValues
        } = await Swal.fire({
            title: 'Settings',
            html: '<p><label for="guessCount">Guess Count:</label>' +
                '<input id="guessCount" type="number" min="' + minGuesses + '"max="' + maxGuesses + '" value="' + guessCount + '" class="swal2-input"></p>' +
                '<label for="wordLength">Word Length:</label>' +
                '<input id="wordLength" type="number" min="' + minWordLength + '" max="' + maxWordLength + '" value="' + wordLength + '" class="swal2-input">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                let validWordLength = false;
                let validGuessCount = false;
                if (parseInt(document.getElementById('guessCount').value) <= maxGuesses && parseInt(document.getElementById('guessCount').value) >= minGuesses) {
                    validGuessCount = true;
                }

                if (parseInt(document.getElementById('wordLength').value) <= maxWordLength && parseInt(document.getElementById('wordLength').value) >= minWordLength) {
                    validWordLength = true;
                }

                if (!validGuessCount && !validWordLength) {
                    Swal.showValidationMessage("Please enter a valid word length and guess count.");
                    Swal.enableButtons();
                } else if (!validGuessCount) {
                    Swal.showValidationMessage("Please enter a valid guess count.");
                    Swal.enableButtons();
                } else if (!validWordLength) {
                    Swal.showValidationMessage("Please enter a valid word length.");
                    Swal.enableButtons();
                } else {
                    guessCount = parseInt(document.getElementById('guessCount').value);
                    wordLength = parseInt(document.getElementById('wordLength').value);

                    // Dynamically update the width of the board so that the grid allows the appropriate number of tiles
                    // https://css-tricks.com/updating-a-css-variable-with-javascript/
                    let root = document.documentElement;
                    root.style.setProperty('--letterCount', wordLength);
                    resetGame();
                }
            },
            didClose: (toast) => {
                document.activeElement.blur(); // Unfocus the button that toggled the toast as enter key presses button again
            }
        });
    })();
}

function chooseRandomWord() {
    let chosenWord = wordList[wordLength][Math.floor(Math.random() * wordList[wordLength].length)].toUpperCase();
    console.log(chosenWord);
    return chosenWord;
}

function drawGame() {
    drawGrid();
    drawKeyboard();
}

function clearGame() {
    clearGrid();
    clearKeyboard();
}

function drawGrid() {
    for (let row = 0; row < guessCount; row++) {
        for (let col = 0; col < wordLength; col++) {
            let tile = document.createElement('span');
            tile.id = row.toString() + "-" + col.toString();
            tile.classList.add('tile');
            tile.innerText = '';
            document.getElementById('board').appendChild(tile);
        }
    }
}

function clearGrid() {
    // Remove grid boxes from grid one by one 
    let board = document.getElementById('board');
    while (board.hasChildNodes()) {
        board.removeChild(board.lastChild);
    }
}

function drawKeyboard() {
    let keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ''],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];
    let keyboardContainer = document.createElement('div');
    keyboardContainer.id = 'keyboard-container';
    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement('div');
            let key = currRow[j];
            keyTile.innerText = key;
            if (key == 'Enter') {
                keyTile.id = 'Enter';
            } else if (key == '⌫') {
                keyTile.id = 'Backspace';
            } else if ('A' <= key && key <= 'Z') {
                keyTile.id = 'Key' + key; // 'Key' + 'A'
            }
            keyTile.addEventListener('click', processKey);
            if (key == 'Enter') {
                keyTile.classList.add('enter-key-tile');
            } else {
                keyTile.classList.add('key-tile');
            }
            keyboardRow.appendChild(keyTile);
        }
        keyboardContainer.appendChild(keyboardRow);
    }
    document.body.appendChild(keyboardContainer);
}

function clearKeyboard() {
    let keyboard = document.getElementById('keyboard-container');
    keyboard.remove();
}

// Resets current row and column to 0 and re-initialised game
function resetGame() {
    col = 0;
    row = 0;
    gameOver = false;
    initialize(false);
}

window.onload = function () {
    initialize(true);
};

function initialize(firstLoad) {
    if (firstLoad) {
        showInstructions();
        document.addEventListener('keyup', (e) => {
            processInput(e);
        });
        let gameSettingsButton = document.getElementById('game-settings');
        gameSettingsButton.addEventListener("click", () => {
            showSettings();
        });
    } else {
        clearGame();
    }
    word = chooseRandomWord();
    drawGame();
}

function processKey() {
    let e = {
        'code': this.id
    };
    processInput(e);
}

function processInput(e) {
    // Check to see if user pressed an alphabet key letter within dictionary order
    if ('KeyA' <= e.code && e.code <= 'KeyZ') {
        if (col < wordLength) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            animateCSS(currTile, 'pulse');

            if (currTile.innerText == '') {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }

    } else if (e.code == 'Backspace') {
        // If column user is currently on is between 0 and less than 5, backspace can be pressed
        if (0 < col && col <= wordLength) {
            col -= 1;
        }

        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = '';

    } else if (e.code == 'Enter') {
        // Function to pull up udate an increment the row by 1
        if (Swal.isVisible()) {
            //If a popup is currently open, close it and allow the player to keep playing
            Swal.close();
        } else if (col == wordLength) {
            // Only call update if 5 letters are entered
            update();
        }
    }

    // If row is equal to guessCount minus, the user has used up all their attempts
    if (!gameOver && row == guessCount) {
        gameOver = true;
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Game Over',
            text: 'The word was: ' + word,
            showConfirmButton: true,
            confirmButtonText: 'Play Again',
            timer: 2500
        }).then(() => {
            resetGame();
        });
        return;
    }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');
        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }
        node.addEventListener('animationend', handleAnimationEnd, {
            once: true
        });
    });

function update() { // iterate all the letters of the word that the user guessed
    //string up the guess word
    let guess = '';
    for (let c = 0; c < wordLength; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase();
    if (!wordList[wordLength].includes(guess)) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: `Sorry, not in word list!`,
            showConfirmButton: false,
            timer: 2500
        });
        return;
    }

    let correct = 0;
    let letterCount = {}; //KENNY _ > {K:1, E:1, N:2, Y:1}
    for (let i = 0; i < word.length; i++) {
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
    for (let c = 0; c < wordLength; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let delay = 250 * c;
        setTimeout(() => {
            animateCSS(currTile, 'flipInX');
        }, delay);
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add('correct');
            let keyTile = document.getElementById('Key' + letter);
            keyTile.classList.remove('inWord');
            keyTile.classList.add('correct');
            correct += 1;
            letterCount[letter] -= 1; // deduct the letter
        }

        // If player wins by guessing the correct word
        // .then() code inspired from https://sweetalert2.github.io/#ajax-request
        if (correct == wordLength) {
            gameOver = true;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You Won!',
                showConfirmButton: true,
                confirmButtonText: 'Play Again',
                timer: 2500
            }).then(() => {
                resetGame();
            });
            return;
        }
    }

    // Go again and mark which ones are present but in the wrong position
    for (let c = 0; c < wordLength; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains('correct')) {

            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add('inWord');
                let keyTile = document.getElementById('Key' + letter);

                if (!keyTile.classList.contains('correct')) {
                    keyTile.classList.add('inWord');
                }
                letterCount[letter] -= 1;
            } // The letter is not in the word
            else {
                currTile.classList.add('notInWord');
                let keyTile = document.getElementById('Key' + letter);
                keyTile.classList.add('notInWord');
            }
        }
    }

    row += 1; // Start new row
    col = 0; // Start at 0 for new row
}