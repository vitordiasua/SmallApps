//Initial global variables
var gamemode = -1;
var cell_counter = -1;
var first_cell = false;
document.getElementById("timer").value = 0;
var timer_counters = 0;
var clicked_counter = 0;



//////////////////////////////////////////////////////////////////// 
//
//GAME CREATION
//
////////////////////////////////////////////////////////////////////

function create_game(value) {
    document.getElementById("title").style.display = 'none';
    document.getElementById("btn_box").style.display= 'none';
    document.getElementById("back").style.display= 'block';
    document.getElementById("container").style.display= 'block';
    document.getElementById("restart_btn").innerHTML = "🗻";
    var ret = generateMinesPositions(parseInt(value));
    var minesPositions = ret.first;
    var noMines = ret.second;
    clicked_counter = 0;
    create_grid(parseInt(value), minesPositions, noMines);
}

function generateMinesPositions(gamemode){
    let noMines = 0;
    var dimensions = 0;
    var minesPositions = []
    switch(gamemode){
        case 0:
            noMines = 10;
            dimensions = 8;
            break;
        case 1:
            noMines = 40;
            dimensions = 14;
            break;  
        case 2:
            noMines = 99;
            dimensions = 20;
            break;
    }

    while( minesPositions.length < noMines){
        pos = { "x":parseInt(Math.random()*dimensions) , "y":parseInt(Math.random()*dimensions) };
        if(!listContains(minesPositions,pos))
            minesPositions.push(pos);
    }
    return {first:minesPositions, second:noMines};
}

function listContains(l , dict){
    return l.some(e => e.x == dict.x && e.y == dict.y); 
}

////////////////////////////////////////////////////////////////////
//
//Grid Manipulation
//
////////////////////////////////////////////////////////////////////

function create_grid(gamemode, minesPos, noMines){
    first_cell = false;
    var dimension = 0;
    var grid = document.getElementById("grid");
    var container = document.getElementById("container");
    checkClassList(grid.classList);
    document.getElementById("timer").innerHTML = "0 0 0";
    document.getElementById("timer").value = 0;
    switch(gamemode){
        case 0:
            dimension = 8;
            document.getElementById("mines_left").innerHTML = "1 0"
            document.getElementById("mines_left").value = 10;
            document.getElementById("restart_btn").style.marginLeft = "45px";
            container.style.width = "210.8px";
            grid.value = 0;
            grid.classList.add('grid-container-easy')
            break;
        case 1:
            dimension = 14;
            document.getElementById("mines_left").innerHTML = "4 0"
            document.getElementById("mines_left").value = 40;
            document.getElementById("restart_btn").style.marginLeft = "117px";
            container.style.width = "366.8px";
            grid.value = 1;
            grid.classList.add('grid-container-med')
            break;  
        case 2:
            dimension = 20;
            container.style.width = "522.8px";
            document.getElementById("mines_left").innerHTML = "9 9"
            document.getElementById("mines_left").value = 99;
            document.getElementById("restart_btn").style.marginLeft = "190px";
            grid.value = 2;
            grid.classList.add('grid-container-hard')
            break;
        default: 
            break;
    }

    for( i = 0; i < dimension; i++){
        for ( j = 0; j< dimension; j++){
            var cell = document.createElement('div');
            cell.id = "c" + ++cell_counter;
            cell.className = 'grid-item';
            cell.value = 0;
            cell.onmouseup = function (){
                check_cell(dimension, noMines);
            }

            cell.addEventListener("contextmenu", e => e.preventDefault());  //Disable right click menu

            document.getElementById('grid').appendChild(cell);
        }
    }

    for(i = 0; i < dimension*dimension; i++){
        var cell = document.getElementById("c" + i);
        if(listContains(minesPos, {x: Math.floor(i/dimension) , y: i%dimension})){
            cell.value = "m";
            addCounterToAdjacent(dimension, cell.id);
        }
    }

    document.getElementById('grid').style.display = 'inline-grid';

}

function deleteDivs(mainDiv){
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
}

function checkClassList(cl){
    if( cl.contains('grid-container-hard')){
        cl.remove('grid-container-hard');
    }
    else if(cl.contains('grid-container-med')){
        cl.remove('grid-container-med');
    }
    else if(cl.contains('grid-container-easy')){
        cl.remove('grid-container-easy');
    }
}

function addCounterToAdjacent(dimension, id){
    id = parseInt(id.substr(1,id.length - 1));
    calc = [- dimension - 1, - dimension, - dimension + 1, - 1 , 1, dimension - 1, dimension , dimension + 1];
    calc.forEach(cont => {
        adj = document.getElementById("c" + (id + cont));
        if( adj != null && adj.value != "m"){
            if( !(id%dimension == 0 && (cont == - dimension - 1 || cont == - 1 || cont == dimension - 1))
                        && !(id%dimension == dimension - 1 && (cont == - dimension + 1 || cont == 1 || cont == dimension + 1))){
                if(adj.value >= 1){
                    adj.value = adj.value + 1; 
                }
                else{
                    adj.value = 1;
                }               
            }
        }
    });
}
 
////////////////////////////////// 
//
//Cell Events
//
//////////////////////////////////

function check_cell(dimension, noMines){

    if (first_cell == false){
        document.getElementById("timer").value = 0;
        timer_counters++;
        var time = setInterval(function() {            
            timerIncrements();
            if(first_cell == false || timer_counters > 1){
                timer_counters--;
                clearInterval(time);
            }    
        }, 1000);
        first_cell = true;
    }

    //Check wich mouse key was used
    var isRight = -1;
    if ("which" in window.event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRight = window.event.which == 3; 
    else if ("button" in window.event)  // IE, Opera 
        isRight = window.event.button == 2; 
    
    if (isRight)
        right_click(event.target);
    else
        left_click(event.target, dimension, noMines);
}

function left_click(cell, dimension, noMines){
    cell.style.borderColor = "rgb(190, 187, 187)";
    cell.style.backgroundColor = "rgb(190, 187, 187)";

    cell.style.fontSize =  "18px";

    cell.onmouseup = function (){ }
    
    var number = cell.value;
    cell.innerHTML = number;

    switch(number){
        case 0:
            cell.innerHTML = "";
            cell.value = "clicked";

            clearNoMines(cell, dimension, noMines);
            break;
        case 1:
            cell.value = "clicked";

            cell.style.color = "blue";
            break;
        case 2:
            cell.value = "clicked";

            cell.style.color = "green";
            break;
        case 3:
            cell.value = "clicked";

            cell.style.color = "red";
            break;
        case 4:
            cell.value = "clicked";

            cell.style.color = "darkviolet";
            break;
        case 5:
            cell.value = "clicked";

            cell.style.color = "red";
            break;
        case 6:
            cell.value = "clicked";

            cell.style.color =  "orange";
            break;
        case "m":
            cell.innerHTML = "🗿";
            cell.style.fontSize = "15px";
            gameOver(dimension, false);
            break;
    }


    clicked_counter = clicked_counter + 1;

    console.log(noMines);
    console.log(dimension*dimension);
    console.log(clicked_counter);
    if(clicked_counter == (dimension*dimension) - noMines)
        gameOver(dimension, true);
}

function right_click(cell){
    if(document.getElementById("mines_left").value > 0 && cell.innerHTML != "🚩"){
            cell.style.fontSize= "15px";
            cell.innerHTML = "🚩";
            sub_mine(); 
    }
    else if(cell.innerHTML == "🚩"){
        cell.innerHTML = "";
        cell.style.fontSize= "18px";
        sum_mine()
    }
}

function gameOver(dimension, win){
    first_cell = false;
    for(i = 0; i < dimension * dimension; i++){
        document.getElementById("c" + i).onmouseup = function (){}
        document.getElementById("c" + i).oncontextmenu = function () {}
    }

    if(win){
        document.getElementById("restart_btn").innerHTML = "🤠";
    }
    else{
        document.getElementById("restart_btn").innerHTML = "🌋";
    }
}

function clearNoMines(cell, dimension, noMines){
    var id = parseInt(cell.id.substr(1,cell.id.length - 1));
    var calc = [- dimension - 1, - dimension, - dimension + 1, - 1 , 1, dimension - 1, dimension , dimension + 1];
    
    for(let i = 0; i < calc.length; i++){
        cont = calc[i];
        adj = document.getElementById("c" + (id + cont));


        if(adj != null && adj.value != "clicked" && !(id%dimension == 0 && (cont == - dimension - 1 || cont == - 1 || cont == dimension - 1))
                    && !(id%dimension == dimension - 1 && (cont == - dimension + 1 || cont == 1 || cont == dimension + 1))){
            left_click(adj, dimension, noMines);
        }
    }
}

////////////////////////////////// 
//
// Restart and Back Buttons Events
//
//////////////////////////////////

function restart_down(){
    document.getElementById("restart_btn").style.borderColor = "rgb(239, 239, 239)";
}

function restart_up(){
    document.getElementById("restart_btn").style.borderColor = "rgb(58, 57, 57)";
    deleteDivs(document.getElementById('grid'))
    cell_counter = -1;
    create_game(document.getElementById("grid").value);
}

function back(){
    document.getElementById("title").style.display = 'block';
    document.getElementById("btn_box").style.display= 'block';
    document.getElementById('container').style.display = 'none';
    document.getElementById('back').style.display = 'none';
    deleteDivs(document.getElementById('grid'))
    gamemode = -1;
    cell_counter = -1;
}


////////////////////////////////// 
//
// Mines Counter
//
//////////////////////////////////

function sub_mine(){
    counter = document.getElementById("mines_left");
    counter.value = counter.value - 1 ;

    if (counter.value.toString().length > 1){
        counter.innerHTML = counter.value.toString()[0] + " " + counter.value.toString()[1];
    }
    else
        counter.innerHTML = "0 " + counter.value;
}


function sum_mine(){
    counter = document.getElementById("mines_left");
    counter.value = counter.value + 1;
    
    if (counter.value > 9 ){
        counter.innerHTML = counter.value.toString()[0] + " " + counter.value.toString()[1];
    }
    else
        counter.innerHTML = "0 " + counter.value;
}

////////////////////////////////// 
//
// Timer Updates
//
//////////////////////////////////

function timerIncrements(){
    time = (document.getElementById("timer").value++ + 1).toString();
    switch(time.length){
        case 1:
            document.getElementById("timer").innerHTML = "0 0 " + time[0];
            break;
        case 2:
            document.getElementById("timer").innerHTML = "0 " + time[0] + " " + time[1];
            break;
        case 3:
            document.getElementById("timer").innerHTML = time[0] + " " + time[1] + " " + time[2];
            break;
    }
}

// 🌋 🚬 🗿	