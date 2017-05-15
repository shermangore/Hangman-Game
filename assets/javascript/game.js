// 1) Create global variables
// - Word List
const dogList = [
					{"breed":"AZAWAKH", "rank":8}, 
					{"breed":"BOXER", "rank":3}, 
					{"breed":"BULLDOG", "rank":3}, 
					{"breed":"BULLMASTIFF", "rank":5}, 
					{"breed":"ROTTWEILER", "rank":4}, 
					{"breed":"COLLIE", "rank":6}, 
					{"breed":"XOLOITZCUINTLE", "rank":10}
				];

// - Number of Guesses
let guessCount = 0;

// - Number Wrong
let wrongCount = 0;

// - Difficulty Level (global?)
let diffLevel = "";

// - Alphabet Array
const alphabet = [
					"a", "b", "c", "d", "e", "f", "g", "h", "i", 
				  	"j", "k", "l", "m", "n", "o", "p", "q", "r", 
				  	"s", "t", "u", "v", "w", "x", "y", "z"
				 ];

// - GameStarted 
let gameStarted = false;

// - Object variable for img tag
let hgImage;

// - Image array to keep track of image order
const imgList = [
					"assets/images/HangMan_Base.png",
					"assets/images/HangMan_Post.png",
					"assets/images/HangMan_Horizontal.png",
					"assets/images/HangMan_Noose.png",
					"assets/images/HangMan_Head.png",
					"assets/images/HangMan_Body.png",
					"assets/images/HangMan_RightArm.png",
					"assets/images/HangMan_LeftArm.png",
					"assets/images/HangMan_RightLeg.png",
					"assets/images/HangMan_LeftLeg.png",
					"assets/images/HangMan_RightFoot.png",
					"assets/images/HangMan_LeftFoot.png"
				];

// - Empty array to fill with letters from the randomly selected word
let theWord = [];

// - Array of the blank spaces - for easy replacement with letters
let arrWord = [];

// - Letters that are guessable (removes duplicates)
let guessableLetters = [];

// - Letters guessed so far
let guessedLetters = [];

// - word was guessed ot max guesses reached
let isPlayable = true;

// 2) Events required
	// - OnKeyUp - to start the game and to guess letters
	// - Reset OnClick - to reset game
	// - Show Answer OnClick - to quit and show all letters
	// - Give Hint OnClick - to show first empty letter
	// - Set up blanks

document.onkeyup = function(event) {
	let userGuess = event.key;

	// Check to verify the pressed key was either alpha or spacebar
	if (alphabet.indexOf(userGuess) !== -1) {
		// If alphabetical key:
		// Check if GameStarted = true
		if (gameStarted && isPlayable) {
				// If false
					// - Ignore it
			// If true
			let ltr = theWord.indexOf(userGuess.toUpperCase());
			let hasBeenGuessed = false;
			
			// - Check to see if selected letter is in the guesses array
				// If the guess is in the list
					// - Ignore it
				// If the guess is not in the list
			if (guessedLetters.indexOf(userGuess.toUpperCase()) === -1) {
					// - Update the guess list with the new letter
				guessedLetters.push(userGuess.toUpperCase());
				hasBeenGuessed = true;

				// Update guessCount label
				document.getElementById("lblGuesses").innerHTML = ++guessCount;						
			}

			// - Check the word list array to see if the letter is in the word
				// If the guess is in the word list,
					// - Update the hangman blanks with the letter
				// If the guess is NOT in the word list
					// - Update the picture to the next picture
					// - Update the wrong guesses count
					// - Check to see if the wrong guesses count > 11
						// If it is > 11
							// - Set GameStarted = false
							// - Display picture to sad dog image
						// If it is <= 11
							// - Ignore it

			if (ltr !== -1) {
				for (let i = 0; i <theWord.length; i++) {
					if (theWord[i] === userGuess.toUpperCase()) {
						arrWord[i] = userGuess.toUpperCase();
					}
				}

				// Rebuild the empty string with correctly guessed letters and keeps the underscores
				document.getElementById("lblWord").innerHTML = arrWord.join(" ");

				// Check the guessed word agains the actual word and stop the game and change the picture
				if (document.getElementById("lblWord").innerHTML.replace(/ /g,'') === theWord) {
					let tempImgNum = Math.floor(Math.random() * 4) + 1;

					isPlayable = false;
					hgImage.src = "assets/images/HappyDog_" + tempImgNum + ".jpg";
				}
			} else {
				// check guessCount
				if (hasBeenGuessed) wrongCount++;

				if (wrongCount < 12) {
					// if < 12, then update hangman image
					hgImage.src = imgList[wrongCount - 1];
				} else if (wrongCount >= 12) {
					// if >= 12, then set image to sad dog 1-5 and stop allowing guesses
					let tempImgNum = Math.floor(Math.random() * 5) + 1;
					hgImage.src = imgList[wrongCount -1];
					isPlayable = false;
					
					setTimeout(function() {
						hgImage.src = "assets/images/SadDog_" + tempImgNum + ".jpg";
					}, 500);
				} else if (wrongCount === 12) {
					isPlayable = false;
				}
			}
		}
	} else if (userGuess === " ") { // check if userGuess is spacebar
		// If spacebar:
		// If true - Ignore it (by default since there is no else/else if)
		// if this is the first press of the spacebar (gamestarted = false _or_ !gameStarted)
		// Check if GameStarted = true
		if (!gameStarted) {
			// If false
			//start game
			hgImage = document.getElementById("imgHangman");

			// - Update GameStarted variable to true
			gameStarted = true;

			// - Set the hangman image to Hangman.png
			hgImage.src = "assets/images/Hangman.png";

			// - Set the guessCount = 0
			guessCount = 0;

			// - Set the wrongCount = 0
			wrongCount = 0;

			// - Get difficult level
			diffLevel = document.querySelector('input[name="diff"]:checked').value;
			
			// - Get word from array
			// - Set hangman blanks to match word (getWord function calls the setBlanks function)
			theWord = getWord(diffLevel);

			// - Set guessableLetters to contain unique letters in word
			for (let i = 0; i <theWord.length; i++) {
				if (guessableLetters.indexOf(theWord[i]) === -1) {
					guessableLetters.push(theWord[i]);
				}
			}
		}
	}

}

function resetGame() {
	// Set guess count = 0
	guessCount = 0;

	// Set difficulty to "easy"
	diffLevel = "easy";

	// Set image src to Hangman.png
	hgImage.src = "assets/images/Hangman.png";

	// Set guess count = 0
	guessCount = 0;

	// Set wrong count = 0
	wrongCount = 0;

	// Set game started = false
	gameStarted = false;

	// Clear guessable letters
	guessableLetters.length = 0;

	// Clear guessed letters
	guessedLetters.length = 0;

	// Clear theWord variable
	theWord.length = 0;

	// Clear arrWord variable
	arrWord.length = 0;

	// Clear blanks/text
	document.getElementById("lblWord").innerHTML = "";

	// Set gameStarted variable to false
	gameStarted = false;
}

function showHint() {
	// Find nearest blank spot in word
	// Get value for that location
	// Update blanks
	var arrHint = document.getElementById("lblWord").innerHTML.split(" ");

	for (let i = 0; i < arrHint.length; i++) {
		if (arrHint[i] === "___") {
			arrHint[i] = theWord[i];
			break;
		}
	}

	document.getElementById("lblWord").innerHTML = arrHint.join(" ");
}

function showAnswer() {
	// Add the answer to the modal window 
	document.getElementById("answer").innerHTML = theWord;

	// Reset the game
	resetGame();
}

function setBlanks(word) {
	let buildWord = "";

	for (let i = 0; i < word.length; i++) {
		buildWord += "___ ";
	}

	buildWord = buildWord.trim();

	document.getElementById("lblWord").innerHTML = buildWord;
	arrWord = document.getElementById("lblWord").innerHTML.split(" ");
}

function getWord(diff) {
	let newList = [];

	if (diff === "easy") {
		for (let i = 0; i < dogList.length; i++) {
			if (dogList[i].rank > 0 && dogList[i].rank < 4) {
				newList.push(dogList[i].breed);
			}
		}
	} else if (diff === "medium") {
		for (let i = 0; i < dogList.length; i++) {
			if (dogList[i].rank > 3 && dogList[i].rank < 8) {
		 		newList.push(dogList[i].breed);
			}
		}
	} else if (diff === "hard") {
		for (let i = 0; i < dogList.length; i++) {
			if (dogList[i].rank > 7 && dogList[i].rank <= 10) {
		 		newList.push(dogList[i].breed);
			}
		}
	}

	let rndNum = Math.floor(Math.random() * (newList.length));

	setBlanks(newList[rndNum]);

	return newList[rndNum];
}