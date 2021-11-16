"use strict";

const numbers = [
    {number: 0, class:"tile_0"},
    {number: 2, class:"tile_2"},
    {number: 4, class:"tile_4"},
    {number: 8, class:"tile_8"},
    {number: 16, class:"tile_16"},
    {number: 32, class:"tile_32"},
    {number: 64, class:"tile_64"},
    {number: 128, class:"tile_128"},
    {number: 256, class:"tile_256"},
    {number: 512, class:"tile_512"},
    {number: 1024, class:"tile_1024"},
    {number: 2048, class:"tile_2048"}
];
let cont = 0;
let score = 0;
let best_score = 0;
let initNumbers = [2,2,2,2,4];
let isActive = true;
let isGenerate = false;
let gameStateWhite = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
let gameState = JSON.parse(JSON.stringify(gameStateWhite));
let gamePastState = JSON.parse(JSON.stringify(gameStateWhite));
let gameStateReverse = JSON.parse(JSON.stringify(gameStateWhite));
let gameStateAnimationWhite = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];
let gameStateAnimation = JSON.parse(JSON.stringify(gameStateAnimationWhite));
let gameStateAnimationReverse = JSON.parse(JSON.stringify(gameStateAnimationWhite));

//--------------- Event -----------------//

window.addEventListener("load", function(event) {
    new_game();
});

window.addEventListener("keydown", function (event) {
    keyEvent(event);
},false);

document.addEventListener('keypress', keyEvent);

//--------------- New Games and Try Again -----------------//

function new_game(){
    isActive = true;
    score = 0;
    
    best_score = localStorage.getItem('best_score');
    document.querySelector("#game_over").style.display = "none";
    document.querySelector("#win").style.display = "none";
    document.querySelector(".best_score_number").innerHTML = best_score;
    document.querySelector(".score_number").innerHTML = score;
    document.querySelector(".best_score_number").innerHTML = best_score;

    gameState =  [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    printWhiteTiles();
    generateNumber();
    generateNumber();
}

//--------------- Generate Numbers -----------------//

function generateNumber() {
    while(isGenerate != true && checkSomeNumber(0) == true){
        var randomRow = Math.floor(Math.random() * 4)
        var randomColumn = Math.floor(Math.random() * 4)
        var randomCase = randomRow.toString()+randomColumn.toString();
        var randomNumber = initNumbers[Math.floor(Math.random() * 5)]

        if(gameState[randomRow][randomColumn] == 0){
            gameState[randomRow][randomColumn] = randomNumber;
            printCase(randomCase, randomNumber, true, "init");
            isGenerate = true;
        }
    }
    isGenerate = false;
}

//--------------- KEY EVENT -----------------//

function keyEvent(event) {
    if(isActive == true){
        gamePastState = JSON.parse(JSON.stringify(gameState));
    
        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                sliceSumSlice();
                break;
            case "ArrowUp":
                event.preventDefault();
                rotationNumbers();
                sliceSumSlice();
                rotationNumbers();
                rotationNumbers();
                rotationNumbers();
                break;
            case "ArrowRight":
                event.preventDefault();
                reverseNumbers();
                sliceSumSlice();
                reverseNumbers();
                break;
            case "ArrowDown":
                event.preventDefault();
                rotationNumbers();
                reverseNumbers();
                sliceSumSlice();
                reverseNumbers();
                rotationNumbers();
                break;
            default:
                return;
        }
    
        if(checkSomeNumber(0) == true && checkChangeState() == true){
            generateNumber();
        }
        print();
        game_over();
    }
}

//--------------- CHECK -----------------//

function game_over(){
    if(checkSomeNumber(2048) == true){
        print();
        if(localStorage.getItem("best_score") < best_score){
            localStorage.setItem("best_score", best_score);
            send_score();
        }
        printFinalScreen("#win")
        isActive = false;
    }else{
        if(checkSomeNumber(0) == false){
            if(checkNumber() == false){
                if(localStorage.getItem("best_score") < best_score){
                    localStorage.setItem("best_score", best_score);
                    send_score();
                }
                printFinalScreen("#game_over")
                isActive = false;
            }
        }
    }
    return isActive;
}

function checkSomeNumber(number){
    return [].concat(...gameState).some(element => element == number); 
}

function checkChangeState(){
    for(var i = 0; i < 4; i++){
        if(gameState[i].toString() != gamePastState[i].toString()){
            return true;
        }
    }
    return false;
}

function checkNumber(){
    for(var i = 0; i < 4; i++){
        for(var y = 0; y < 3; y++){
            if(gameState[i][y] == gameState[i][y+1]){
                return true;
            }
            if(gameState[y][i] == gameState[y+1][i]){
                return true;
            }
        }
    }
    return false;
}

//--------------- PRINT IN HTML -----------------//

function print(){
    for(var i = 0; i < 4; i++){
        for(var y = 0; y < 4; y++){
            printCase(i+""+y, gameState[i][y], gameStateAnimation[i][y], "sum");
        }
    }
    printScore();
}

function printCase(randomCase, number, animation, typeAnimation){
    if(number != 0){
        document.getElementById(randomCase).removeAttribute("class")
    
        var numbersClass = numbers.find(numbers => numbers.number === number);
        document.getElementById(randomCase).innerHTML = number;
        document.getElementById(randomCase).classList.add(numbersClass.class);
        if(animation == true){
            animationsCase(randomCase, typeAnimation);
        }
    }else{
        document.getElementById(randomCase).removeAttribute("class");
        document.getElementById(randomCase).innerHTML = "";
    }
}

function animationsCase(randomCase, typeAnimation){
    setTimeout(function(){ 
        document.getElementById(randomCase).classList.add(typeAnimation);
        setTimeout(function(){ 
            document.getElementById(randomCase).classList.remove(typeAnimation);
        },5000);
    },0.5); 
}

function printScore(){
    document.querySelector(".score_number").innerHTML = score;
    if(score > best_score){
        best_score = score;
        document.querySelector(".best_score_number").innerHTML = best_score;
    }
}

function printFinalScreen(id){
    document.querySelector(id).style.display = "block";
    document.querySelector(id).classList.add("opacity");
    setTimeout(function(){ 
        document.querySelector(id).classList.remove("opacity");
    }, 1000);
}

function change_color_description(){
    document.querySelector("#description_content").classList.add("colorchange");
    setTimeout(function(){ 
        document.querySelector("#description_content").classList.remove("colorchange");
    }, 3000);
}

function printWhiteTiles(){
    for(var i = 0; i < 4; i++){
        for(var y = 0; y < 4; y++){
            document.getElementById(i+""+y).innerHTML = "";
            document.getElementById(i+""+y).removeAttribute("class");
        }
    }
}

//--------------- ROTATION AND REVERSE NUMBERS-----------------//

function reverseNumbers(){
    for(var i = 0; i < 4; i++){
        gameState[i].reverse();
        gameStateAnimation[i].reverse();
    }
}

function rotationNumbers(){
    gameStateReverse = JSON.parse(JSON.stringify(gameStateWhite));
    gameStateAnimationReverse = JSON.parse(JSON.stringify(gameStateAnimationWhite));

    for(var i = 0; i < 4; i++){
        for(var y = 0; y < 4; y++){
            gameStateReverse[y][i] = gameState[i][y];
            gameStateAnimationReverse[y][i] = gameStateAnimation[i][y];
        }
    }

    gameStateAnimation = JSON.parse(JSON.stringify(gameStateAnimationReverse));
    gameState = JSON.parse(JSON.stringify(gameStateReverse));
}

//-------------- SLIDE AND SUM NUMBERS ------------------//

function sliceSumSlice(){
    gameStateAnimation = JSON.parse(JSON.stringify(gameStateAnimationWhite));

    for(var i = 0; i < 4; i++){
        slideNumbers(i);
        sumNumbers(i);
        slideNumbers(i);
    }
}

function slideNumbers(i){
    let zeros = [0, 0, 0, 0];

    gameState[i] = gameState[i].filter(val => val > 0);
    var numberOfZeros = 4 - gameState[i].length;
    zeros.length = numberOfZeros;
    gameState[i] = gameState[i].concat(zeros);
}

function sumNumbers(i){
    for(var y = 0; y < 4; y++){
        if(gameState[i][y] == gameState[i][y+1] && gameState[i][y] != 0 && gameState[i][y+1] != 0){
            gameStateAnimation[i][y] = true; 
            gameState[i][y] = gameState[i][y] + gameState[i][y+1];
            gameState[i][y+1] = 0;
            score = score + gameState[i][y];
        }
    }
}

//-------------- SEND SCORE ------------------//

function send_score() {
    var token = localStorage.getItem("token");
    
    if (token) {
        var http = new XMLHttpRequest();
        var url = 'http://0.0.0.0:4000/api/rank/update';
        var params = JSON.stringify({
            nameGame: "2048",
            score: best_score
        });
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.setRequestHeader('Authorization', 'Token ' + token);

        http.onreadystatechange = function() { //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                console.log(http.responseText);
            }
        }
        http.send(params);
    }
}