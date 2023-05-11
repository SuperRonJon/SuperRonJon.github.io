var numSquares = 6;
var colors = [];
var goal;
var winStreak = 0;
var longestStreak = [0, 0, 0];
var totalLives = 3;
var mode = 0;
var curLives;

//getting references
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.getElementById("message");
var h1 = document.querySelector("h1");
var resetBtn = document.getElementById("reset");
var modeButtons = document.querySelectorAll(".mode");
var livesDisplay = document.querySelector("#livesDisplay");
var winStreakDisplay = document.querySelector("#winStreakDisplay");
var longestStreakDisplay = document.querySelector("#longestStreakDisplay");
var resetStreak = true;
var resetLongest = false;
var hasLost = false;

init();

function init()
{
	//mode button event listeners
	setupModeButtons();
	//setup reset button event listener
	resetBtn.addEventListener("click", function(){
		reset();
	});

	//set up square colors
	setupSquares();
	//reset the screen
	reset();
}

function setupModeButtons()
{
	for(var i = 0; i < modeButtons.length; i++)
	{
		//add event listeners to each difficulty button
		modeButtons[i].addEventListener("click", function(){
			//remove the selected class from each button and add it to the correct one
			modeButtons.forEach(button => button.classList.remove("selected"));
			this.classList.add("selected");
			//update the number of squares based on the difficulty chosen
			if(this.textContent === "Easy")
			{
				numSquares = 6;
				totalLives = 3;
				mode = 0;
			}
			else if(this.textContent === "Normal")
			{
				numSquares = 9;
				totalLives = 2;
                mode = 1;
			}
			else
			{
				numSquares = 6;
				totalLives = 1;
                mode = 2;
			}
			//reset the display
			resetStreak = true;
			reset();		
		});
	}
}

function setupSquares()
{
	for(var i = 0; i < squares.length; i++)
	{
		//add click listeners to the squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var thisColor = this.style.backgroundColor;
			//compare color to the goal
			if(hasLost) 
			{
				loseGame();
			}
			else if(thisColor === goal)
			{
				//the color picked was correct
				winGame();
			}
			else if(!this.classList.contains("deactivated"))
			{
				this.classList.add('deactivated')
				messageDisplay.textContent = "Try Again";
				curLives--;
				updateLivesDisplay();
				if(curLives === 0)
				{
					loseGame();
				}
			}
		});
	}
}

function winGame()
{
	messageDisplay.textContent = "Correct!";
	endGame();
	resetStreak = false;
}

function loseGame()
{
	messageDisplay.textContent = "You lose.";
	hasLost = true;
	endGame();
}

//Changes page colors to correct color and changes the text of the reset button
function endGame()
{
	changeColors(goal);
	h1.style.backgroundColor = goal;
	resetBtn.textContent = "Play Again?";
}

function changeColors(color)
{
	//loop through all squares and change them to match the given color
	for(var i = 0; i < squares.length; i++)
	{
		squares[i].style.backgroundColor = color;
	}
}

//returns a random color from the colors array
function pickColor()
{
	var rand = Math.floor(Math.random() * colors.length);
	return colors[rand];
}

//generates amount number of random colors and returns them in an array as strings
function generateRandomColors(amount)
{
	var result = [];
	//loop through amount times and pick a random number between 0 and 255 for each of red green and blue
	for(var i = 0; i < amount; i++)
	{
		result.push(randomColor());
	}
	return result;
}

function randomColor()
{
	//pick a red green and blue from 0 to 255 and return that rgb value as a string
	var newColor = "rgb(";
	for(var j = 0; j < 3; j++)
	{
		newColor += Math.floor(Math.random() * 255 + 1);
		if(j != 2)
		{
			newColor += ", ";
		}
		else
		{
			newColor += ")";
		}
	}
	return newColor;
}

function reset()
{
	//generate all new colors
	colors = generateRandomColors(numSquares);
	//pick a new random goal color
	goal = pickColor();
	//reset the amount of lives
	curLives = totalLives;
	updateLivesDisplay();
	//update the win streak display
	if (resetStreak) {
		winStreak = 0;
	} else {
		winStreak++;
		if(winStreak > longestStreak[mode]) {
            longestStreak[mode] = winStreak;
        }
	}
    if (resetLongest) {
        longestStreak[mode] = 0;
	}
	winStreakDisplay.textContent = "win streak: " + winStreak;
	longestStreakDisplay.textContent = "longest streak: " + longestStreak[mode];
	resetStreak = true;
	resetLongest = false;
	hasLost = false;
	//change goal display
	colorDisplay.textContent = goal;
	//change the colors of the squares
	for(var i = 0; i < squares.length; i++)
	{
		if(colors[i])
		{
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		}
		else
		{
			squares[i].style.display = "none";
		}

		if(squares[i].classList.contains('deactivated')) {
			squares[i].classList.remove('deactivated');
		}
	}
	//reset h1 background color
	h1.style.backgroundColor = "steelblue";
	messageDisplay.textContent = "";
	//change button text back to "New Colors"
	resetBtn.textContent = "New Colors";
}

function updateLivesDisplay()
{
	livesDisplay.textContent = "lives: " + curLives;
}