// Game Variables

// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth = 24;
var worldHeight = 24;

var time = 200; 
var moves = 0; 
var classes = ['mustard', 'plum', 'scarlet', 'peacock', 'green', 'white'];
var currentPlayer; 
var turn = 0; 

var dicefaces = [
	'&#9856;', 
	'&#9857;',
	'&#9858;',
	'&#9859;',
	'&#9860;',
	'&#9861;'
]

var characters = [
	{ 
		"name": "Professor Plum", 
		"imgPath": "/img/clue/plum.jpg",
		"class": 'plum'
	},
	{ 
		"name": "Colonel Mustard", 
		"imgPath": "/img/clue/mustard.jpg",
		"class": 'mustard'
	},
	{ 
		"name": "Miss Scarlet", 
		"imgPath": "/img/clue/scarlet.jpg",
		"class": 'scarlet'
	},
	{ 
		"name": "Mr. Green", 
		"imgPath": "/img/clue/green.jpg",
		"class": 'green'
	},
	{ 
		"name": "Mrs. White", 
		"imgPath": "/img/clue/white.jpg",
		"class": 'white'
	},
	{ 
		"name": "Mrs. Peacock", 
		"imgPath": "/img/clue/peacock.jpg",
		"class": 'peacock'
	}	
]

var weapons = [
	{ 
		"name": "Rope", 
		"imgPath": "/img/clue/rope.jpg"
	},
	{ 
		"name": "Pipe", 
		"imgPath": "/img/clue/pipe.jpg"
	},
	{ 
		"name": "Knife", 
		"imgPath": "/img/clue/knife.jpg"
	},
	{ 
		"name": "Wrench", 
		"imgPath": "/img/clue/wrench.jpg"
	},
	{ 
		"name": "Candlestick", 
		"imgPath": "/img/clue/candlestick.jpg"
	},
	{ 
		"name": "Pistol", 
		"imgPath": "/img/clue/pistol.jpg"
	}	
]

var cardRooms = [
	{ 
		"name": "Study", 
		"displayImg": "/img/clue/study1.jpg",
		"imgPath": "/img/clue/roomstudy.jpg",
		"secret": "studykitchen",
		"secretSq": ["sq72","sq570"], 
		"doors": [78]
	},
	{ 
		"name": "Library",
		"imgPath": "/img/clue/roomlibrary.jpg", 
		"displayImg": "/img/clue/library2.jpg",
		"doors": [198, 243]
	},
	{ 
		"name": "Billiard",
		"imgPath": "/img/clue/roombilliard.jpg", 
		"displayImg": "/img/clue/billiard.jpg",
		"doors": [289, 365]
	},
	{ 
		"name": "Conservatory",
		"imgPath": "/img/clue/roomconservatory.jpg", 
		"displayImg": "/img/clue/conservatory.jpg",
		"secret": "conservatorylounge", 
		"secretSq":["sq457", "sq143"],
		"doors": [460]
	},
	{ 
		"name": "Hall",
		"imgPath": "/img/clue/roomhall.jpg", 
		"displayImg": "/img/clue/hall.jpg", 
		"doors": [105, 155, 156]
	},
	{ 
		"name": "Ballroom",
		"imgPath": "/img/clue/roomballroom.jpg", 
		"displayImg": "/img/clue/ballroom2.jpg", 
		"doors" : [464, 417, 422, 471]
	},
	{ 
		"name": "Lounge",
		"imgPath": "/img/clue/roomlounge.jpg", 
		"displayImg": "/img/clue/lounge.jpg",
		"secret": "conservatorylounge", 
		"secretSq":["sq143","sq457"],
		"doors": [137]
	},
	{ 
		"name": "Dining",
		"imgPath": "/img/clue/roomdining.jpg", 
		"displayImg": "/img/clue/dining2.jpg", 
		"doors": [304, 233]
	},
	{ 
		"name": "Kitchen",
		"imgPath": "/img/clue/roomkitchen.jpg", 
		"displayImg": "/img/clue/kitchen.jpg",
		"secret": "studykitchen",
		"secretSq":["sq570", "sq72"], 
		"doors": [451]
	}	
];

var playerArray = []; 
var winArray = [];
var guessArray = []; 
var precard = characters.concat(weapons);
var everycard = precard.concat(cardRooms); 


var Player = function(name, type) {
  this.name = name;
  this.type = type; 
  this.cards = [];  
  this.oppcards = []; 
  this.active = false;  
  this.hasRolled = false; 
  this.inRoom = ""; 
  this.suggestionArray = [];
  this.suggestionGuess; 
  this.disprover = false;  
  this.lastSquare; 
  this.path = []; 
}

// END GAME VARIABLES


// this function shuffles an array
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// BEGIN START GAME FUNCTIONS

// function creates user player
function createUser(name, array){
	playerArray.push(new Player(name, "user"));
}

// function returns an array of random characters for cpu to play
function getCpuPlayers(number, name){
	var cpuArray = []; 
	var k = 0
	shuffle(characters);
	do{
		var toCheck = characters[k].name;
		if (name != toCheck){
			cpuArray.push(toCheck)
			k++;
		} else {
			k++;
		}
	}
	while(cpuArray.length < number);
	return cpuArray;
}

// this function adds the cpu players
function completePlayers(array){
	array.forEach(function(charName) {
		playerArray.push(new Player(charName, "cpu"));
	})
}

// this function deals out the cards to all players
function dealCards(array){
	shuffle(array);
	var forWin = array.shift();
	winArray.push(forWin); 
	var m = 0; 	
	array.forEach(function(card){
		if (m == playerArray.length){
			m = 0; 
		}
		var player = playerArray[m];
		var addTo = player.cards; 
		addTo.push(card);
		m++; 
	})
	array.push(forWin);
}

// this function generates the checklist
function generateCheckbox(){
	characters.forEach(function(character){
		$('#suspects').append("<li class='show' id=" + character.imgPath + "><input type='checkbox' disabled ='true' value='" + character.name + "'> " + character.name + "</li>");
	})
	weapons.forEach(function(weapon){
		$('#weapons').append("<li class='show' id=" + weapon.imgPath + "><input type='checkbox' disabled ='true' value='" + weapon.name + "'> " + weapon.name + "</li>");
	})
	cardRooms.forEach(function(location){
		$('#locations').append("<li class='show' id=" + location.imgPath + "><input type='checkbox' disabled ='true' value='" + location.name + "'> " + location.name + "</li>");
	})
}

// this function checks the cards each player has and marks their checklist
function checkCards(){
	var huplay = playerArray[0];
	var checkboxes = $('input'); 
	var hucards = huplay.cards;
	var oppcards = huplay.oppcards; 
	hucards.forEach(function(hucard){ 
		$('input').each(function(i, checkbox){
			var boxval = checkbox.value;  
			if (hucard.name == boxval){
				if (!checkbox.checked){
					checkbox.checked = true; 
					var parent = checkbox.parentElement;
					parent.style.color = 'green';  
				}
			}
		})
	})
	oppcards.forEach(function(oppcard){ 
		var disprover; 
		playerArray.forEach(function(player){
			if (player.disprover){
				 disprover = player; 
			}
		})
		$('input').each(function(i, checkbox){
			var boxval = checkbox.value;  
			if (oppcard.name == boxval){
				if (!checkbox.checked){
					checkbox.checked = true; 
					var parent = checkbox.parentElement;
					parent.style.color = disprover.colorCode;  
				}  
			}
		})
	})

}

// this function sets the player's start square
function startSquares(){
	var starts = $('.start');
	var b = 0
	shuffle(starts); 
	playerArray.forEach(function(player){
		var one = starts[b];
		var two = "#" + $(one).attr('id');  
		player.lastSquare = two; 
		b++; 
	})
	startColors();
}

// this function sets the players color class
function startColors(){
	playerArray.forEach(function(player){
		switch(player.name){
			case 'Professor Plum': 
				$(player.startSquare).addClass('plum');
				player.color = 'plum';
				player.colorCode = 'purple'; 
				break;
			case 'Colonel Mustard':
				$(player.startSquare).addClass('mustard');
				player.color = 'mustard';
				player.colorCode = '#FFDB58'; 
				break;
			case "Miss Scarlet":
				$(player.startSquare).addClass('scarlet');
				player.color = 'scarlet';
				player.colorCode = '#cc0000'; 
				break;
			case "Mr. Green":
				$(player.startSquare).addClass('green');
				player.color = 'green';
				player.colorCode = 'darkgreen';
				break;
			case "Mrs. White":
				$(player.startSquare).addClass('white');
				player.color = 'white';
				player.colorCode = 'lightgrey'; 
				break;
			case "Mrs. Peacock":
				$(player.startSquare).addClass('peacock');
				player.color = 'peacock';
				player.colorCode = 'darkblue'; 
				break; 
		}
	})
}

// END START GAME FUNCTIONS

// this function sets the current player
function activeStart(){
	currentPlayer = playerArray[turn];
	var toActive = currentPlayer.lastSquare;
	currentPlayer.active = true; 
	$(toActive).addClass("activePlayer");
}

// this checks if the active player is human or not
function checkPlayerType(){
	if (currentPlayer.type == 'user'){
		return true; 
	} else {
		return false; 
	}
}

// CPU TURN FUNCTIONS

// this function gets a number for the cpu player 
function cpuRoll(){
	var rand = Math.floor(Math.random()*12) + 1;
	moves = rand; 
	currentPlayer.hasRolled = true;
	logThis('dice'); 
	return moves; 
}

function getRoomArray(){
	var roomArray = []; 
	var cpuCards = currentPlayer.cards.concat(currentPlayer.oppcards);
	cardRooms.forEach(function(room){
		if ($.inArray(room, cpuCards == -1)){
			roomArray.push(room); 
		}
	})
	return roomArray; 
}

function pickRoom(array){
	var rand = Math.floor(Math.random()* array.length);
	var cpuRoom = array[rand];
	console.log(cpuRoom);
	currentPlayer.room = cpuRoom; 
	return cpuRoom; 
}

function pickDoor(array){
	var doorChoice, doorX, doorY;  
	if (array.length > 1){
		var rand = Math.floor(Math.random()* array.length);
		doorChoice = array[rand];
	} else {
		doorChoice = array[0];
	}  
	doorX = doorChoice.attr("data-x");
	doorY = doorChoice.attr("data-y");
	doorCoords = [doorX, doorY]
	return doorCoords; 
}

function createWorld()
{
  // create emptiness
  for (var x=0; x < worldWidth; x++)
  {
    world[x] = [];
    
    for (var y=0; y < worldHeight; y++)
    {
      world[x][y] = 1;
    }
  }

  // find coordinates for this

  $('td').each(function(){
  	var that = $(this); 
  	if (that.hasClass('hallway') || that.hasClass('doors')){
  		var xcoord = that.attr('data-x');
  		var ycoord = that.attr('data-y'); 
  		world[xcoord][ycoord] = 0; 
  	}
  })
}

// BEGIN PATH ALGORITHM

function findPath(world,pathStart,pathEnd){
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;
	// the world data are integers:
	// anything higher than this number is considered blocked
	// this is handy is you use numbered sprites, more than one
	// of which is walkable road, grass, mud, etc
	var maxWalkableTileNum = 0;
	// keep track of the world dimensions
	// Note that this A-star implementation expects the world array to be square: 
	// it must have equal height and width. If your game world is rectangular, 
	// just fill the array with dummy values to pad the empty space.
	var worldWidth = 24;
	var worldHeight = 24;
	var worldSize =	worldWidth * worldHeight;

	var distanceFunction = ManhattanDistance;
	var findNeighbours = function(){};

	function ManhattanDistance(Point, Goal)
	{	// linear movement - no diagonals - just cardinal directions (NSEW)
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	 // Neighbours functions, used by findNeighbours function
	// to locate adjacent available cells that aren't blocked

	// Returns every available North, South, East or West
	// cell that is empty. 
	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	// returns boolean value (world cell is available and open)
	function canWalkHere(x, y)
	{
		return ((world[x] != null) &&
			(world[x][y] != null) &&
			(world[x][y] <= maxWalkableTileNum));
	};

	// Node function, returns a new object with Node properties
	// Used in the calculatePath function to store route costs, etc.
	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the distanceFunction cost to get
			// TO this Node from the START
			f:0,
			// the distanceFunction cost to get
			// from this Node to the GOAL
			g:0
		};

		return newNode;
	}

	// Path function, executes AStar algorithm operations
	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		// create an array that will contain all world cells
		var AStar = new Array(worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until until the Open list is empty
		return result;
	}

	 // actually calculate the a-star path!
	// this returns an array of coordinates
	// that is empty if no path is possible
	return calculatePath();
}

// END PATH ALGORITHM

// TO CALL FUNCTION ABOVE 
function getPath(end){
	// start and end of path
	var lastSquare = currentPlayer.lastSquare; 
	var currX = parseInt($(lastSquare).attr("data-x"));
	var currY = parseInt($(lastSquare).attr("data-y"));
	var pathStart = [currX, currY];
	var pathEnd = end; 
	currentPlayer.path = findPath(world,pathStart,pathEnd);
}

// this function gets the suggestion from the human player
function suggestion(){   
	var charChoice = $('#suggChar').val().toLowerCase();
	var weapChoice = $('#suggWeap').val().toLowerCase();
	var roomChoice = $('#suggRoom').val().toLowerCase();
	playerArray[0].suggestionGuess = [charChoice, weapChoice, roomChoice];

	// RUN FUNCTION HERE TO SEPARATE THE CPU AND USER CHOICE
	logThis('suggestion'); 
	suggArrayMaker(charChoice);
	suggArrayMaker(weapChoice);
	suggArrayMaker(roomChoice);	
}

// this function grabs any cards held by a player that has been suggested
function suggArrayMaker(choice){ 
	playerArray.forEach(function(player){
		if (!player.active){
			var playerCards = player.cards;
			var wherePush = player.suggestionArray;
			playerCards.forEach(function(card){
				if (card.name.toLowerCase() == choice){
					wherePush.push(card); 
				}
			})	
		}
	}) 
}

// this function checks if the suggestion arrays are all empty
function noDisprovers(){
	var cant = 0;
	var otherPlayers = playerArray.length - 1; 
	playerArray.forEach(function(player){
		if (!player.active){
			var canProve = player.suggestionArray;
			if (canProve.length == 0){
				cant++; 
			}	
		}
	})
	if (cant == otherPlayers){
		return true;
	} else {
		return false; 
	}
}

// this function checks if a player has cards from a suggestion
function checkPlayer(id){
	var thisGuy = playerArray[id];
	if (thisGuy.suggestionArray.length > 0){
		return thisGuy;
	} else {
		id += 1;
		return checkPlayer(id);  
	}
}

// this function finds the next player following the current player with cards for a suggestion
function nextPlayer(){ 
	var playerInd; 
	if (turn == playerArray.length - 1){
		playerInd = 0; 
	} else {
		playerInd = turn + 1; 
	} 
	var playerWithCards = checkPlayer(playerInd);
	return playerWithCards; 
}

// this function chooses a card to show
function suggestionChooser(){
	var cpuChoice; 
	var playerToChoose = nextPlayer(); 
	playerToChoose.disprover = true; 
	logThis('disprover');
	if (playerToChoose.type = "cpu"){
		if (playerToChoose.suggestionArray.length > 1){
			var rand = Math.floor(Math.random()*2);
			cpuChoice = playerToChoose.suggestionArray[rand]; 
			return cpuChoice; 
		} else {
			cpuChoice = playerToChoose.suggestionArray[0]; 
			return cpuChoice; 
		}
	} else if (playerToChoose.type = "user"){
		// INSERT FUNCTION USER CHOOSE CARD TO SHOW HERE
	}
}

// this shows a card to the user
function showCard(card){
	var disprover;
	var getsCard; 
	playerArray.forEach(function(player){
		if (player.active){
			getsCard = player;
		}
	})
	playerArray.forEach(function(player){
		if (player.disprover){
			 disprover = player; 
		}
	})
	$('#myDisplayTitle').text(disprover.name + " has shown you a card.")
	createCard(card.imgPath);
	getsCard.oppcards.push(card); 
	$('#displayModal').modal('show');
	checkCards(); 
}

// this function creates the select choices for a suggestion
function getSuggCats(){
	var huplayer = playerArray[0];
	huplayer.allcards = huplayer.cards.concat(huplayer.oppcards);
	var huCards = huplayer.allcards;
	shuffle(characters);
	shuffle(weapons);
	$('#suggChar').html("");
	$('#suggWeap').html(""); 
	$('#suggRoom').html("");
	characters.forEach(function(character){
		if ($.inArray(character, huCards) == -1){
			$('#suggChar').append("<option>" + character.name + "</option>"); 
		}
	})
	weapons.forEach(function(weapon){
		if ($.inArray(weapon, huCards) == -1){
			$('#suggWeap').append("<option>" + weapon.name + "</option>"); 
		}
	})
	$('#suggRoom').append("<option>" + huplayer.inRoom + "</option>");
}

// this function tabs to any section
function tab(number){
	var tsection = '#t-' + number; 
	var ssection = '#s-' + number; 
	$('.tabs li').removeClass('current');
	$('section').removeClass('current');
	$(tsection).addClass('current');
	$(ssection).addClass('current');
}

// this function creates card
function createCard(path){
	$('#card').css("background", "url(" + path + ")");
	$('#card').css("background-size", "cover");
}

// this function clears the card message
function clearCardMessage(){
	$('#myDisplayTitle').text("");
	$('#card').css("background", "");
}

function getRoomName(){
	var enteredRoom; 
	var where = $('.activePlayer').attr('class');
	var whereArray = where.split(" "); 
	rooms.forEach(function(room){
		if ($.inArray(room, whereArray) != -1){
			enteredRoom = room; 
		}
	})
	return enteredRoom;
}

function getRoomImage(name){
	var roomImage; 
	cardRooms.forEach(function(room){
		if (name == room.name.toLowerCase()){
			roomImage = room.displayImg; 
		}
	})
	return roomImage; 
}

function showRoom(path){
	$('#clueRoom').css('background', 'url(' + path + ')');
	$('#clueRoom').css('background-size', 'cover');
	$('#clueRoom').slideDown('slow');
}

function room(){
	var roomname = getRoomName(); 
	var imagePath = getRoomImage(roomname);
	showRoom(imagePath);
	tab(5);
}

function updateTurn(){
	if (turn == playerArray.length - 1){
		turn = 0; 
	} else {
		turn++; 
	} 
	return turn; 
}

function resetPlayers(){
	playerArray.forEach(function(player){
		player.active = false;  
    	player.hasRolled = false;  
    	player.suggestionArray = [];
    	player.suggestionGuess; 
    	player.disprover = false;
	})
}

function endTurn(){
	resetPlayers(); 
	tab(9);
	turn = updateTurn(); 
}

// this logs the various events of the game
function logThis(play){
	if (play == 'new'){
		var opponents = []; 
		playerArray.forEach(function(player){
			if (player.type == 'user'){
				$('#gameLog').append("<p>You are " + player.name + ".</p>");
			} else {
				opponents.push(player.name); 
			}
		})
		var lastName = opponents.pop();
		var oppString = opponents.join(", ");
		$('#gameLog').append("<p>Your opponents are " + oppString + " and " + lastName + ".</p>"); 
	} else if (play == 'dice'){
		 playerArray.forEach(function(player){
			if (player.active == true){
				$('#gameLog').append("<p>" + player.name + " rolled a " + moves + ".</p>");
			} 
		})
	} else if (play == 'enter'){
		var thisRoom = getRoomName();
		playerArray.forEach(function(player){
			if (player.active == true){
				$('#gameLog').append("<p>" + player.name + " entered the " + thisRoom + ".</p>");
				player.inRoom = thisRoom; 
			} 
		})

	} else if (play == 'suggestion'){
		playerArray.forEach(function(player){
			if (player.active == true){
				$('#gameLog').append("<p>" + player.name + " suggests " + player.suggestionGuess[0] + " with the " + player.suggestionGuess[1] + " in the " + player.suggestionGuess[2] + ".</p>"); 
			} 
		})
	} else if (play == 'disprover'){
		playerArray.forEach(function(player){
			if (player.disprover == true){
				$('#gameLog').append("<p>" + player.name + " has shown a card."); 
			} 
		})
	}

}

// Game Setup

$(document).ready(function() {
	createWorld(); 
});

$(document).ready(function() {
	generateCheckbox();
	$('#movesAvail').html(moves); 
	$('#start').click(function(){
		$.each(characters, function(i, character){
			$("#characterSelect").append("<option>" + character.name + "</option>");
		})
		$('#newGame').modal('show')
	})
});

// this handles the game start
$(document).ready(function() {
	$("#begin").click(function(e) {
		var numPlayers = $('#playerSelect').val();
		var playerName = $('#characterSelect').val();
		var cpuNum = numPlayers -1;
		createUser(playerName);
		var cpuNames = getCpuPlayers(cpuNum, playerName);
		completePlayers(cpuNames);
		startSquares();
		dealCards(characters);
		dealCards(weapons);
		dealCards(cardRooms);
		checkCards();
		activeStart();  
		// console.log(playerArray); 
		$("#t-1").hide('slow');
		logThis('new');

		tab(8);
		e.preventDefault();
	});
});

// this handles opening the suggestion chooser modal
$("#sugg").click(function(e) {
	getSuggCats();
	$('#sugAcc').modal('show');
})

// this handles submit of a suggestion
$("#suggSub").click(function(e){
	suggestion(); 
	var cpuPlayerChoice = suggestionChooser(); 
	showCard(cpuPlayerChoice); 
	tab(10);	
})

// this shows a card from checklist
$(document).on('click', '.show', function(e) {
	var that = $(this).attr('id');
	clearCardMessage(); 
	createCard(that);
	$('#displayModal').modal('show');
})

// Tab Handlers
$('.tabs li').click(function tabbers(){
  id = ($(this).attr('id')).split('-');
  $('.tabs li').removeClass('current');
  $('section').removeClass('current');
  $('#t-'+id[1]).addClass('current');
  $('#s-'+id[1]).addClass('current');
});

// Movement Handlers
function moveSquare(direction, current, color){
	if($(direction).hasClass('hallway')){
		$(current).removeClass("activePlayer");
    	$(direction).addClass("activePlayer");
    	$(current).removeClass(color);
    	$(direction).addClass(color);
	} else if ($(direction).hasClass('doors')){
		$(current).removeClass("activePlayer");
    	$(direction).addClass("activePlayer"); 
    	$(current).removeClass(color);
    	$(direction).addClass(color);
    	setTimeout(function(){
    		$(direction).animate({
    			"background-color": "#ADD8E6",
    			}, "slow")
			moves = 0; 
    		$('#movesAvail').html(moves);
    	},500)
    	logThis('enter');
    	setTimeout(function(){
    		room();
    	},2000) 
		// insert function to handle room here
	}
}

// this gets the class of a square
function getCharClass(square){
	var toChange; 
	classes.forEach(function(charClass){
		if($(square).hasClass(charClass)){
			toChange = charClass; 
		}
	})
	return toChange;
}

// this handles moving the square
$(document).keydown(function(e){ 
    var active = $('.activePlayer'); 
    var activeNum = $(active).data('id');
    var activeSq = "#sq" + activeNum;
    var charColor = getCharClass(activeSq); 
    var left = "#sq" + (activeNum - 1); 
    var right = "#sq" + (activeNum + 1);
    var up =  "#sq" + (activeNum - 24);
    var down = "#sq" + (activeNum + 24);
    if (moves > 0){	
		if (e.keyCode == 37) { // left
			moveSquare($(left), active, charColor)
			moves--;
			$('#movesAvail').html(moves); 
			e.preventDefault();
		} else if (e.keyCode == 39) { // right
		    moveSquare($(right), active, charColor)
		    moves--;
		    $('#movesAvail').html(moves);
			e.preventDefault();
		} else if (e.keyCode == 38) { // up
		    moveSquare($(up), active, charColor)
		    moves--;
		    $('#movesAvail').html(moves);
			e.preventDefault();
		} else if (e.keyCode == 40) { // down
		    moveSquare($(down), active, charColor)
		    moves--;
		    $('#movesAvail').html(moves);
			e.preventDefault();
		}
    }
})

//this rolls the dice FOR USER ONLY. 
	
$('#roll').click(function sides(){	
	// if (currentPlayer.hasRolled == false){
	// 	setTimeout(function(){
	// 		var rand = Math.floor(Math.random()*6);
	// 		var rand2 = Math.floor(Math.random()*6);
	// 		$('#die1').html(dicefaces[rand]);
	// 		$('#die2').html(dicefaces[rand2]); 
	// 		if (time < 800){
	// 			time += 71; 
	// 			sides(); 
	// 		} else if (time > 800){
	// 			time = 200;
	// 			var rolled1 = rand + 1;  
	// 			var rolled2 = rand2 + 1; 
	// 			moves = rolled1 + rolled2; 
	// 			$('#movesAvail').html(moves);
	// 			currentPlayer.hasRolled = true; 
	// 			logThis('dice');
	// 		}
	// 	}, time)
	// }
	moves = 12; 
	$('#movesAvail').html(moves);
})
// End Movement Handlers


