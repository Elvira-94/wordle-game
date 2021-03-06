// Javascript code below influenced by "Build a Wordle Clone in Javascript HTML CSS" tutorial https://youtu.be/ckjRsPaWHX8
// And "Build a Wordle Clone in Javascript HTML CSS Part 2" tutorial https://youtu.be/MM9FAV_CEkU
import {
    wordList
} from "./possible-words.js";

const mobileScreenWidthThreshold = 950;
const maxGuesses = 10;
const minGuesses = 1;
const maxWordLength = 7;
const minWordLength = 3;

// Choose a random config for wordLength and guessCount (within upper and lower bounds) to start the game with
let guessCount = Math.floor(Math.random() * (maxGuesses - minGuesses) + minGuesses);
let wordLength = Math.floor(Math.random() * (maxWordLength - minWordLength) + minWordLength);
let root = document.documentElement;
root.style.setProperty('--letterCount', wordLength);

let row = 0;
let col = 0;
let gameOver = false;
let word = '';
let current_user = '';
let alertWidth = "";

if (window.innerWidth < mobileScreenWidthThreshold) {
    alertWidth = "90%";
} else {
    alertWidth = "30%";
}

Swal.bindClickHandler();
Swal.mixin({
    toast: false,
    didClose: (toast) => {
        document.activeElement.blur();
    }
}).bindClickHandler('data-swal-template');

/**
 * Shows the instructions for the game as an alert.
 * Creates a promise for the alert, so that only when the alert is closed does the function resolve.
 */
async function showInstructions() {

    let promise = new Promise(function (resolve) {
        Swal.fire({
            template: '#game-instructions',
            width: alertWidth,
            didClose: (toast) => {
                resolve();
            }
        });
    });

    await promise;
}

/**
 * 
 * Creates a JSON object containing stats with 0 guesses (per wordLength setting)
 * 
 * @param {string} user 
 */
function populateNewUserStats(user) {
    let scores = {};

    for (let i = 1; i <= maxWordLength; i++) {
        scores[i] = {};
        for (let j = 1; j <= maxGuesses; j++) {
            scores[i][j] = 0;
        }
    }

    localStorage.setItem(user, JSON.stringify(scores));
}

/**
 * 
 * Returns a users stats as a JSON object. Called by other functions. 
 * 
 * Reference below is inspiration for storing JSON in local storage
 * https://stackoverflow.com/questions/2010892/how-to-store-objects-in-html5-localstorage
 * 
 * @param {string} user 
 * @param {number} wordLength 
 * @returns 
 */
function getUserStats(user, wordLength = null) {

    if (!localStorage.getItem(user)) {
        populateNewUserStats(user);
    }

    if (wordLength) {
        return JSON.parse(localStorage.getItem(user))[wordLength];
    } else {
        return JSON.parse(localStorage.getItem(user));
    }
}

/**
 * 
 * Displays a users stats as an alert on the page. Calls getUserStats() to populate stat data
 * 
 * @param {string} user 
 * @param {number} wordLength 
 */
function displayUserStats(user, wordLength) {
    let stats = getUserStats(user, wordLength);
    let divContainer = document.createElement('div');
    divContainer.innerText = 'Word Length: ' + wordLength;

    let totalGuesses = 0;
    for (let i = 0; i < Object.keys(stats).length; i++) {
        let item = Object.keys(stats)[i];
        totalGuesses = totalGuesses + parseInt(stats[parseInt(item)]);
    }

    for (let i = 0; i < Object.keys(stats).length; i++) {
        let item = Object.keys(stats)[i];
        let guessNum = parseInt(item);
        let percentage = Math.ceil((parseInt(stats[guessNum]) / totalGuesses) * 100);
        let innerDiv = document.createElement('div');

        innerDiv.classList.add('progress');
        innerDiv.setAttribute("data-label-left", guessNum);
        innerDiv.setAttribute("data-label-right", stats[guessNum]);

        let span = document.createElement('span');
        span.classList.add('value');
        span.style = "width:" + percentage + "%;";

        innerDiv.appendChild(span);
        divContainer.appendChild(innerDiv);
    }


    Swal.fire({
        position: 'center',
        icon: 'info',
        width: alertWidth,
        title: 'Stats for ' + current_user,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        html: divContainer,
        didClose: (toast) => {
            document.activeElement.blur();
        }
    });

}

/**
 * 
 * Increments a high score value for a given user using the current word length configuration of the page 
 * 
 * @param {string} user
 * @param {number} guessNum  
 */
function incrementStats(user, guessNum) {
    let userStats = getUserStats(user);

    userStats[wordLength][guessNum] = parseInt(userStats[wordLength][guessNum]) + 1;
    localStorage.setItem(user, JSON.stringify(userStats));
}

/**
 * 
 *  Displays an alert that allows the user to configure their game. 
 * 
 */
function showSettings() {
    // SweetAlert2 Multiple Inputs not suported so this is their recommended method:
    // https://sweetalert2.github.io/#input-types
    (async () => {
        await Swal.fire({
            title: 'Settings',
            html: '<p><label for="guessCount">Guess Count:</label>' +
                '<input id="guessCount" type="number" min="' + minGuesses + '"max="' + maxGuesses + '" value="' + guessCount + '" class="swal2-input"></p>' +
                '<label for="wordLength">Word Length:</label>' +
                '<input id="wordLength" type="number" min="' + minWordLength + '" max="' + maxWordLength + '" value="' + wordLength + '" class="swal2-input">',
            focusConfirm: false,
            showCancelButton: true,
            width: alertWidth,
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

/**
 * 
 * @returns Choose a random word from the pre-populated wordList and return it to the caller
 */
function chooseRandomWord() {
    let chosenWord = wordList[wordLength][Math.floor(Math.random() * wordList[wordLength].length)].toUpperCase();
    return chosenWord;
}

/**
 * Draws the game resources
 */
function drawGame() {
    drawGrid();
    drawKeyboard();
}

/**
 * Clears the game resources
 */
function clearGame() {
    clearGrid();
    clearKeyboard();
}

/**
 * Draws the board grid based on the game configurations specified by the user
 */
function drawGrid() {
    let board = document.getElementById('board');
    let header = document.getElementsByTagName('header')[0];
    board.style.width = header.offsetWidth;

    let tileSize = calculateTileSize({
        maxItemWidthRem: header.offsetWidth / 16,
        numItemsPerRow: wordLength,
        itemMargin: 0,
        itemBorder: 2
    });

    let fontSize = tileSize * 0.6;

    for (let row = 0; row < guessCount; row++) {
        for (let col = 0; col < wordLength; col++) {
            let tile = document.createElement('span');
            tile.id = row.toString() + "-" + col.toString();
            tile.classList.add('tile');
            tile.innerText = '';

            tile.style.height = tileSize + "px";

            tile.style.width = tileSize + "px";

            tile.style["font-size"] = fontSize + "px";

            board.appendChild(tile);
        }
    }
}

/**
 * Removes the game board elements so that a new board can be redrawn
 */
function clearGrid() {
    // Remove grid boxes from grid one by one 
    let board = document.getElementById('board');
    while (board.hasChildNodes()) {
        board.removeChild(board.lastChild);
    }
}

/**
 * Based on sizing input provided, will determine the optimal tile size in order to have all necessesary tiles fit on the users screen.
 * If the size of the tile exceeds a certain size, then the tile be capped at the max size
 * 
 * @param {*} param
 * @returns number 
 */
function calculateTileSize({
    remSize = 16,
    maxItemWidthRem = 30,
    numItemsPerRow = 10,
    itemMargin = 2.5,
    itemBorder = 1,
    bodyBorder = 8
} = {}) {

    let maxItemSize = 4 * remSize;
    let totalMargin = ((itemMargin * numItemsPerRow) + itemMargin) + ((itemBorder * numItemsPerRow) + itemBorder) + (bodyBorder * 2);
    let windowSize = window.innerWidth;
    let maxContainerWidth = maxItemWidthRem * remSize;

    if (windowSize > maxContainerWidth) {
        windowSize = maxContainerWidth;
    }

    let tileSize = (windowSize - totalMargin) / numItemsPerRow;
    if (tileSize > maxItemSize) {
        return maxItemSize;
    } else {
        return Math.floor(tileSize);
    }
}

/**
 * Draws the grid for the the keyoard on the screen scaled according to the users screensize.
 */
function drawKeyboard() {
    let keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ''],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '???']
    ];
    let keyboardContainer = document.createElement('div');
    keyboardContainer.id = 'keyboard-container';

    let tileSize = calculateTileSize();
    let fontSize = tileSize * 0.6;

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
            } else if (key == '???') {
                keyTile.id = 'Backspace';
            } else if ('A' <= key && key <= 'Z') {
                keyTile.id = 'Key' + key; // 'Key' + 'A'
            }

            keyTile.addEventListener('click', processKey);

            if (key == 'Enter') {
                keyTile.classList.add('key-tile');
                keyTile.style.width = (tileSize * 2) + "px";
            } else {
                keyTile.classList.add('key-tile');
                keyTile.style.width = tileSize + "px";
            }

            keyTile.style['font-size'] = fontSize + "px";

            keyboardRow.appendChild(keyTile);
        }
        keyboardContainer.appendChild(keyboardRow);
    }
    document.body.appendChild(keyboardContainer);
}

/**
 * Clears the keyboard elements from the page so that a new keyboard can be drawn
 */
function clearKeyboard() {
    let keyboard = document.getElementById('keyboard-container');
    keyboard.remove();
}

/** 
 * Resets current row and column to 0, gameOver to false and re-initialises game for replay
 */
function resetGame() {
    col = 0;
    row = 0;
    gameOver = false;
    initialize(false);
}

/**
 * Prompts the user to input their name. 
 * If we have previously had a user play the game, we prepopulate the input with the last user's name
 */
async function getPlayingUser() {
    let lastKnownUser = localStorage.getItem('lastKnownUser');
    let inputText = "";

    if (lastKnownUser) {
        inputText = lastKnownUser;
    }

    const {
        value: user
    } = await Swal.fire({
        position: 'center',
        icon: 'info',
        width: alertWidth,
        title: "Who's Playing?",
        input: 'text',
        inputLabel: 'Your name: ',
        inputValue: inputText,
        showConfirmButton: true,
        confirmButtonText: 'Submit',
        inputValidator: (value) => {
            if (!value) {
                return 'Please enter a name!';
            }
        }
    });

    if (user) {
        current_user = user;
        localStorage.setItem('lastKnownUser', current_user);
    }
}

window.onload = function () {
    initialize(true);
};

/**
 *  Initialises game resources, listeners, and starts the game
 * 
 * @param {boolean} firstLoad - Whether it is the first time the page has been loaded after a refresh or not. 
 */
async function initialize(firstLoad) {

    if (!firstLoad) {
        clearGame();
    }

    word = chooseRandomWord();
    drawGame();

    if (firstLoad) {
        await showInstructions().then(async () => {
            await getPlayingUser(); // We want to ask the user for their name on first opening of the site, after the welcome/instructions alert
        });

        getUserStats(current_user);
        document.addEventListener('keyup', (e) => {
            processInput(e);
        });

        let gameSettingsButton = document.getElementById('game-settings');
        gameSettingsButton.addEventListener("click", () => {
            showSettings();
        });

        let gameStatsButton = document.getElementById('game-stats');
        gameStatsButton.addEventListener("click", () => {
            displayUserStats(current_user, wordLength);
        });
    }
}

/**
 * When a key is clicked on the keyboard element on the page, this function registers the key 
 * with a code and passes it to the function that handles key presses
 */
function processKey() {
    let e = {
        'code': this.id
    };
    processInput(e);
}

/**
 * Checkes key presses and adds letters if alphabet letters were pressed, removes letters if backspace was pressed, and submits a guess
 * if enter is pressed (and all letters are entered) 
 * 
 * @param {*} e - an object representing the key pressed
 * @returns 
 */
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
            width: alertWidth,
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
/**
 * Handles animations using animate.css library
 *
 * @param {*} element 
 * @param {*} animation 
 * @param {*} prefix 
 * @returns 
 */
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


/**
 * Called when a guess is submitted. 
 * Checks the guess by iterating through each lette of the word, and determining
 * if the letter is:
 * 1. incorrect
 * 2. correct, in the wrong postion
 * 3. correct, in the correct position
 * 
 * If the guess is fully correct, it will inform the user of their success and start the game again
 * 
 * @returns 
 */
function update() {

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
            width: alertWidth,
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
            keyTile.style.color = "#222F3E";
            correct += 1;
            letterCount[letter] -= 1; // deduct the letter
        }

        // If player wins by guessing the correct word
        // .then() code inspired from https://sweetalert2.github.io/#ajax-request
        if (correct == wordLength) {
            gameOver = true;

            incrementStats(current_user, row + 1);

            Swal.fire({
                position: 'center',
                icon: 'success',
                width: alertWidth,
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
            if (word.includes(letter)) {
                if (letterCount[letter] > 0) {
                    currTile.classList.add('inWord');
                    let keyTile = document.getElementById('Key' + letter);
                    keyTile.classList.add('inWord');
                    keyTile.style.color = "#222F3E";
                } else {
                    currTile.classList.add('notInWord');
                }

                letterCount[letter] -= 1;
            } else {
                currTile.classList.add('notInWord');
                let keyTile = document.getElementById('Key' + letter);
                keyTile.classList.add('notInWord');
            }
        }
    }

    row += 1; // Start new row
    col = 0; // Start at 0 for new row
}