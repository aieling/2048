var container = $('.grid-container');
var cell = $('.grid-cell');
var row = $('.grid-row');
var dialog = $('#dialog');
var grid = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];
var score = 0;

$(function() {
    container.css('background-color','#ca9b68');
    container.css('width','300px');
    container.css('height','300px');
    container.css('border','5px solid #ca9b68');
    container.css('border-radius','5px');
    cell.css('border-radius','3px');
    cell.css('border','5px solid #ca9b68');
    cell.css('background-color','#dec0a0');
    row.css('display','flex');
    row.css('height','25%');
    row.css('width','100%%');
    cell.css('width','100%');
});

$.fn.game = function() {
    score = 0;
    addNumber();
    addNumber();
    drawGame();
};

$( ".play" ).click(function() {
    location.reload();
 });
 
$( "html" ).game();



function buildGrid(){
    let newGrid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    return newGrid;
}

function addNumber(){
    let options = [];
    for(i=0; i< 4; i++){
        for(j=0; j< 4; j++){
            if(grid[i][j] === 0){
                options.push({
                    x:i,
                    y:j
                });
            } 
        }
    }
    if(options.length > 0){
        spot = Math.floor(Math.random() * options.length);
        grid[options[spot].x][options[spot].y] = Math.random() > 0.4 ? 2 : 4;
    }
    return grid;
}

//check change
function copyGrid(grid){
    let copy = buildGrid();
    for(i=0; i<4; i++){
        for(j=0; j< 4; j++){
            copy[i][j] = grid[i][j];
        }
    }
    return copy;
}

function compareGrid(grid, copy){
    for(i=0; i<4; i++){
        for(j=0; j< 4; j++){
            if(copy[i][j] != grid[i][j]){
                return true;
            }
        }
    }
    return false;
}

function drawGame(){
    var k = 0;
    for(i=0; i<4; i++){
        for(j=0; j< 4; j++){
            $('.grid-cell').eq(k).empty();
            var classNames = $('.grid-cell').eq(k).attr('class');
                    let classes = removeColor(classNames);
                     for(var a=0; a<classes.length; a++){
                             classes.forEach(element => {
 
                              $('.grid-cell').eq(k).removeClass(element); 
                              
                              });                                 
                     }
            if(grid[i][j] != 0){
                $('.grid-cell')[k].append(grid[i][j]); 
                $('.grid-cell').eq(k).addClass("color"+grid[i][j]); 
            }  
            k++;        
        }
    };
    $('.score').text(score); 
}

function slide(row){
    // create a table with only value not null
   let array = row.filter(value =>value);
   let numberEmptyCells = row.length - array.length;
   let arrayEmpty = Array(numberEmptyCells).fill(0);
   array = array.concat(arrayEmpty);
   return array;
}

function addition(row){
    for(i=0; i<4; i++){
            if(row[i] == row[i+1]){
                row[i] = row[i] + row[i+1];
                row[i+1] = 0;
                score+= row[i];
            }
    }
    return row;
}

function operate(row){
    row = slide(row);
    row= addition(row);
    row = slide(row);
    return row;
}

function reversedRow(row){
    row = row.reverse();
}

function rotatedRow(grid){
    let blank = buildGrid();

    for(i=0; i<4; i++){
        for(j=0; j< 4; j++){
            blank[i][j] = grid[j][i];
        }
    }
    return blank;
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] == 0) {
          return false;
        }
        if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
          return false;
        }
        if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }

function isGameWon() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] == 2048) {
          return true;
        }
      }
    }
    return false;
}

function showDialog(){
    $("#dialog").html("Dialog Text.");
    $("#dialog").dialog().dialog('open');
}

$("body").keydown(function(e) {
    let copy = copyGrid(grid);
    let play = true;
    let gameover = isGameOver();
    let gamewon = isGameWon();
 
    if (gameover) {
        $('#dialog').modal('show');
        $('#status').html("Game over");
    }

    if (gamewon) {
        $('#dialogWin').modal('show');
        $('#status').html("You win");
    }


    if(e.keyCode == 37) { // left
       
      for(var i=0; i<4; i++){
          grid[i] = operate(grid[i]);
      }  
    }

    else if(e.keyCode == 39) { // right 
        
      for(var i=0; i<4; i++){
          reversedRow(grid[i]);
          grid[i] = operate(grid[i]);
          reversedRow(grid[i]);
      }
    }

    else if(e.keyCode == 38) { // up
        
        grid = rotatedRow(grid);
        grid = rotatedRow(grid);
        grid = rotatedRow(grid);
        for(var i=0; i<4; i++){
            grid[i] = operate(grid[i]);
        }
        grid = rotatedRow(grid);
    }

    else if(e.keyCode == 40) { // down
        
        grid = rotatedRow(grid);

        for(var i=0; i<4; i++){
            reversedRow(grid[i]);
            grid[i] = operate(grid[i]);
            reversedRow(grid[i]);
        }
        grid = rotatedRow(grid);
        grid = rotatedRow(grid);
        grid = rotatedRow(grid);
    }
    else{
        play = false;
    }

    if(compareGrid(copy, grid)){
        if(play = true){
            addNumber();
            drawGame();
        }
    }
});

function removeColor(classNames){
    var current_classes = classNames.split(" "), // change the list into an array
    classes_to_remove = []; // array of classes which are to be removed

    current_classes.forEach(class_name => {
        if (/color.*/.test(class_name)) {
            classes_to_remove.push(class_name); 
        }
    });
     // turn the array back into a string
     return classes_to_remove;
}

