# **Wordle++ - Project Portfolio 2 - Javascript**

Wordle++ is based on the popular New York Times online 5-letter word game. Wordle is a game of guessing words. Every day, you must guess a new word. You have six attempts, and each one provides some hints.

However, Wordle++ was created with customisation in mind as the user can easily change their mystery word count and even add more guesses! This gives the user a more fun and challenging way to play the game. How about guessing a mystery 3-letter word in 10 tries, how cool is that!

You can view the live site here - <a href="https://elvira-94.github.io/wordle-game/" target="_blank"> Wordle++ </a>

# User Experience (UX)

## Site Aims

* To provide the user with an online word game to guess a random 3 to 7 letter word in 6 to 10 tries.

* To create a word game that encourages the user to reset the game and customise their guesses and word lengths.

* To provide a game that is fully responsive so the user can play across multiple devices.

* To provide a feel-good experience by allowing the user to navigate the site easily.

## User Stories

The **user** is any person who likes to play word guessing games and would like to test their knowledge based on their preferred word count and guess attempts.

| ID | ROLE | ACTION | GOAL |
|-----------------|:-------------|:---------------:|:---------------:|
| 1 | USER | As a user, I want to be able play Wordle++ | So I can test my knowledge at guessing mystery words on a daily basis|
| 2 | USER | As a user, I want to be able to navigate around the interface easily | So it doesn't take me out of the experience|
| 3 | USER | As a user, I want to be able to play Wordle++ across multiple devices | So I can play Wordle++ while on the go or in different locations |
| 4 | USER | As a user, I want to be able to choose a more difficult Wordle++ game | So I can challenge myself  |
| 5 | USER | As a user, I want to be able to start the game when I am ready | So I can prepare myself |
| 6 | USER | As a user, I want to be able to track my score | So I can improve upon it |
| 7 | USER | As a user, I want to see the right answer highlighted if I use up all of my guesses | So I can see which letters were missing in the word |
| 8 | USER | As a user, I want to be able to start a new random Wordle++ when the current one ends | So I can see if I can beat my score |
| 9 | USER | As a user, when I play Wordle++ I want to be able to customize the amount of guesses or letters in the word (e.g guess a 3-letter word in 4 tries) | So the game can be as challenging as possible |

## Design Choices

### Colour Scheme

After reviewing several color schemes with potential users of the site, I settled on the following Canadian Palette by Dmitri Litvinov, which allows for a lively color palette with acceptable contrast ratios.

* Background color: #222f3e
* Tile Color Hints: #1dd1a1 (Correct Letter), #feca57 (Letter In Word), #576574 (Letter Not In Word)
* Keyboard color: #c8d6e5 
* Text: #fff a stardard white that allows text to be easily read on the dark background

<p align="center"><img src="docs/images/color-scheme.png" width="50%" height="50%" alt="Colour palette"></p>

### Typography

For this site, the main font that was used is a standard 'Arial' which defaults back to 'Helvetica, sans-serif.' 

## Wireframe Mock-ups

### Desktop

<p align="center"><img src="docs/images/desktop.png" width="60%" height="60%" alt="Low Fidelity Desktop Wireframe"></p>

### Tablet

<p align="center"><img src="docs/images/tablet.png" width="50%" height="50%" alt="Low Fidelity Tablet Wireframe"></p>

### Mobile

<p align="center"><img src="docs/images/mobile.png" width="50%" height="50%" alt="Low Fidelity Mobile Wireframe"></p>

## Site Structure

# Features

## Navigation

## Home Screen

## Settings Screen

## How to Play Screen

# Future Features

# Technologies Used
* [HTML5](https://en.wikipedia.org/wiki/HTML) - to provide the content and structure for the site.
* [CSS3](https://en.wikipedia.org/wiki/CSS) - to provide the styling for the site.
* [Javascript](https://en.wikipedia.org/wiki/HTML) - to provide the functionality for the site.
* [Gitpod](https://www.gitpod.io/) - to create and edit the site's code.
* [Github](https://github.com/) - to host and deploy the site.
* [Gitbash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) - to push changes to the GitHub repository.
* [Balsamiq](https://balsamiq.com/) - to create low fidelity wireframes for site.
* [Sweet Alert2](https://sweetalert2.github.io/) - to implement pop-ups for user input and answers.
* [Animate.css](https://animate.style/) - to animate elements for the site.
* [Flat UI Colours](https://flatuicolors.com/palette/ca) to reference colours for this site that would look well together.
* [Compressor](https://compressor.io/) - to compress the images.
* [WCAG](https://chrome.google.com/webstore/detail/wcag-color-contrast-check/plnahcmalebffmaghcpcmpaciebdhgdf?hl=en) - to test the contrast and accessibility of the site using an extension installed on the Google browser.
* [Lighthouse](https://developers.google.com/web/tools/lighthouse) - to test the quality of the site's performance.
* [Google Chrome DevTools](https://developer.chrome.com/docs/devtools/) - to debug and test responsiveness of the site.
* [VS Code](https://code.visualstudio.com/) - to test the local development of the site.

# Testing

## Code Validation

## Lighthouse Testing

## Accessibility Testing

## Responsiveness Testing

## Functionality Testing

## Manual Testing

## Bugs Stories

During the creation of this project, I discovered a number of issues that slowed progress; examples of the major bugs and their remedies are shown below.

### Bug:
When inputting the letters in the column, it initially stopped working after implementing a query selector to get the id of the letters. Chrome Dev Tools gave off the following warning: Uncaught DOMException: Failed to execute 'querySelector' on 'Document': '0-0' is not a valid selector.

### Fix:
To fix this, I decided to change the query selector to get element by ID which targetted the id instead.

### Result:
This fixed the issue and the letters could be inputted and seen clearly in the columns without issue.

### Bug:
When you typed 5 'Q's, you could see that you got 5 hints but the word is 'QUEEN' where there is only one 'Q' in the word so only the green hint should show up.

### Fix:
<!-- TODO -->

### Result: 
<!-- TODO -->
### Bug:
You could make a guess with two letters for example.

### Fix:
To fix this, I need to add a check to see if all 5 letters were entered before calling the update function.

### Result:
'If col == width" fixed this issue so you could only make a guess when all 5 letters were entered by the user.

### Bug:
If you entered an invalid word the game still processed it.

### Fix:
To fix his, I added a return statement to check if the guess the user inputs is a valid word inside the update function. 

### Result:
If you entered an invalid word the game now did not move you along the next guess and wouldn't give you any hints so the user could go back and change their guess.

### Bug:
When you hit enter to get rid of the pop-up, it would submit the user's guess again causing the pop-up to keep popping up.

### Fix:
<!-- TODO -->

### Result:
Now if you enter a word such as 'APPLE' when you hit enter, the pop-up now goes away.

### Bug:
When you clicked the instructions button, the button would be focused when the user continues to play the game.

### Fix:
This was fixed by unfocusing the button using .blur() after the alert is closed.

### Result:
Now when the user hits enter, the button is pressed again rather than the guess being submitted.



## Bugs Unfixed

# Deployment

To deploy the site on GitHub pages, the following steps should be followed:

1. On your Github page, go to your site's repository.

2. Under your repository name, click **Settings**.

3. Click **Pages**, in the left sidebar.

4. Under **"GitHub Pages"**, select a publishing source from the None or Branch drop-down menu box. Then click **Save**.

5. The page will automatically refresh, indicating that the website has now been launched.

6. Return to the **GitHub Pages** section to obtain the link to the deployed website.

Further reading and troubleshooting on deploying a site on GitHub pages can be found [here](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## How To Run This Site Project Locally

To clone this site's project from GitHub, the following steps should be followed:

1. On your GitHub page, go to your site's main page of your repository.

2. Above your site's files, click the **Code** button.

3. To clone your repository ussing HTTPS, click the copy clipboard symbol under "Clone with HTTPS".

4. Open your local IDE terminal.

5. Change the current working directory to the desired location for the cloned directory.

6. Type ```git clone```, followed by the URL you copied earlier in Step 3.
```console
git clone https://github.com/Elvira-94/wordle-game.git
```

7. Press Enter. Your local clone will be created.

Further reading and troubleshooting on cloning a repository from GitHub can be found [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

# Credits 

## Content

* [W3Schools](https://www.w3schools.com/) - to help learn and understand vital coding concepts used to help build this site.
* [Youtube Wordle Tutorial (Part 1)](https://youtu.be/ckjRsPaWHX8) - to help build a HTML/CSS/Javascript Wordle game following instructions by Kenny Yip Coding.
* [Youtube Wordle Tutorial (Part 2)](https://youtu.be/MM9FAV_CEkU) - to help build a HTML/CSS/Javascript Wordle game following instructions by Kenny Yip Coding.
* [Youtube Wordle Clone Tutorial](https://youtu.be/mpby4HiElek) - to create the game of Wordle using Javascript following instructions by Code with Ania Kubów.
* [Word Game Helper](https://www.wordgamehelper.com/) - to extract 3-7 letter word lists for the site.
* [Wordle](https://www.nytimes.com/games/wordle/index.html) - to extract 5-letter words & guesses for the site.
* [CSS Tricks](https://css-tricks.com/updating-a-css-variable-with-javascript/) - to dynamically update the width of the board so that the grid allows the appropriate number of tiles.
* [Free Code Camp Tutorial](https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/) - to better understand how to implement animate.css to site and to creat import word lists to js script following instructions by Paul Akinyemi.
* [Digital Ocean Tutorial](https://www.digitalocean.com/community/tutorials/for-loops-for-of-loops-and-for-in-loops-in-javascript) - to better understand how to implement for loops to site code following instructions by Tania Rascia.
* [Stack Overflow](https://stackoverflow.com/questions/2010892/how-to-store-objects-in-html5-localstorage) - to implement storing JSON objects in local storage for keeping track of user stats.
* [Article by Borislav Hadzhiev](https://bobbyhadz.com/blog/javascript-unexpected-reserved-word-await) - to help resolve unexpected reserved word 'await' Error in code.
* [W3Schools Javascript Async/Await](https://www.w3schools.com/js/tryit.asp?filename=tryjs_async2) - to help solidify learning async and await functions to make promises easier to write in code.
* [W3Schools Javascript Promises](https://www.w3schools.com/js/js_promise.asp) - to help solidify learning Javascript promises.
























# Acknowledgements