var specials = ['gameBorder', 'doors', 'hallway', 'secret', 'start'];

var rooms = ["study", "library", "billiard", "conservatory", "hall", "clue", "ballroom", "lounge", "dining", "kitchen"];

function completeBoard(array, string){
	$.each(array, function(i, item){
		var id = '#sq' + item;
		if (string != 'hallway'){
			if($(id).hasClass('hallway')){
				$(id).removeClass('hallway'); 
			}
			$(id).addClass(string);
		} else {
			if($(id).hasClass('room')){
				$(id).removeClass('room');
			}
			$(id).addClass(string);
		}
	})
}

function borders(array){
	$.each(array, function(i, row){
		$(row).addClass('edge');
	})
}

function clueMap(){
	$.each(specials, function(i, feature){
		switch(feature){
			case "gameBorder":
				var border = [6,8, 15, 96, 144, 240, 264, 408, 456, 558, 569, 455, 215, 167];
				completeBoard(border, feature);
				break;
			case "doors":
				var doors = [202, 203, 204, 304, 233, 78, 105, 155, 156, 137, 198, 451, 243, 289, 365, 460, 464, 417, 422, 471];
				completeBoard(doors, feature);
				break;
			case "hallway":
				var hallway = [150, 246, 461, 560, 561, 566, 567, 376, 377, 378];
				$('#sq560').removeClass('room');
				$('#sq561').removeClass('room');
				$('#sq566').removeClass('room');
				$('#sq567').removeClass('room');
				completeBoard(hallway, feature);
				break;
			case "secret":
				var secret = [72, 143, 457, 570];
				completeBoard(secret, feature);
				break;
			case "start":
				var start = [16, 191, 120, 432, 562, 565]
				completeBoard(start, feature);
				break;
		}
	})
}

// display rooms
function clueRooms(){
	$.each(rooms, function(i, room){
		switch(room){
			// colstart, width, square, height, place
			case 'study':
				makeRooms(1, 7, 0, 4, room);
				break;
			case 'library':
				makeRooms(1, 7, 6, 5, room);
				break;
			case "billiard":
				makeRooms(1, 6, 12, 5, room);
				break;
			case "conservatory":
				makeRooms(1, 6, 19, 5, room);
				break;
			case "hall":
				makeRooms(10, 6, 0, 7, room);
				break;
			case "clue":
				makeRooms(10, 5, 8, 7, room);
				break;
			case "ballroom":
				makeRooms(9, 8, 17, 7, room);
				break;
			case "lounge":
				makeRooms(18, 7, 0, 6, room);
				break;
			case "dining":
				makeRooms(17, 8, 9, 7, room);
				break;
			case "kitchen":
				makeRooms(19, 6, 18, 6, room);
				break;
		}
	})
}

// function to design rooms
function makeRooms(colstart, width, square, height, place){
	var columns = []; 
	// var toStart = column[index];
	for (var i = 0; i < width; i++){ 
		var column = ".column" + colstart; 
		columns.push(column);
		colstart++;
	}
	// console.log(columns);
	$.each(columns, function(j, col){
		var box = square; 
		for (var j = 0; j < height; j++){
			var toAnimate = $(col)[box];
			$(toAnimate).removeClass('hallway');
			$(toAnimate).addClass(place);
			$(toAnimate).addClass('room');
			box++; 
		} 
	})

}

// function to make game board
function gameBoard(){
	for (var i = 0; i < 24; i++){
		$('table').append("<tr class='row" + (i + 1) + "'></tr>");
	}
	$.each($('tr'), function(i, row){
		for (var i = 0; i < 24; i++){
			$(row).append("<td class='column" + (i + 1) + "'></td>");
	  	}
	});
	$.each($('td'), function(i, square){
		$(square).attr("id", "sq" + i);
		$(square).attr( "data-id", i );
		$(square).addClass('hallway');
	})
}

// functions to create grid
function yBoard(){
	var rows = $('tr');
	var j = 0;  
	for (var i = rows.length - 1; i >= 0; i--){
		var children = rows[i].children;
		$(children).attr("data-y", j);
		j++; 
	}
}

function xBoard(){
	var rows = $('tr');
	var xaxis = 0;
	for (var i = 1; i <= rows.length; i++){
		var columnName = '.column' + i; 
		var column = $(columnName);
		column.attr("data-x", xaxis);
		xaxis++; 
	}
}

function coordinates(){
	var solosq = $('td');
	solosq.each(function(){
		var x = $(this).attr("data-x");
		var y = $(this).attr("data-y");
		var xy = "" + x +"by" + y + "";
		$(this).addClass(xy);
		// $(this).html(xy);  
	})
}

// function to create everything
function clueSetUp(){
	gameBoard(); 
	clueRooms(); 
	clueMap(); 
	yBoard(); 
	xBoard(); 
	coordinates(); 
}

clueSetUp();