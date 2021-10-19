const diceDiv = document.querySelector(".actualdice");
const diceFaceElements = [document.getElementById('1dots'), document.getElementById('2dots'), document.getElementById('3dots'), document.getElementById('4dots'), document.getElementById('5dots'), document.getElementById('6dots')];
const announceAreaText = document.querySelector(".announcetext");
const announceAreaInput = document.querySelector(".announceinput");
const announceArea = document.querySelector(".announcearea");
const playerTurnBoxElement = document.querySelector(".playerturn");
const playerWalkButtonElement = document.querySelector(".walkbutton");
const playerExcreteButtonElement = document.querySelector(".excretebutton");
const nestUnitElementIds = [
    document.querySelector("#rednest" + 1),
    document.querySelector("#rednest" + 2),
    document.querySelector("#rednest" + 3),
    document.querySelector("#rednest" + 4),
    document.querySelector("#bluenest" + 1),
    document.querySelector("#bluenest" + 2),
    document.querySelector("#bluenest" + 3),
    document.querySelector("#bluenest" + 4),
    document.querySelector("#greennest" + 1),
    document.querySelector("#greennest" + 2),
    document.querySelector("#greennest" + 3),
    document.querySelector("#greennest" + 4),
    document.querySelector("#yellownest" + 1),
    document.querySelector("#yellownest" + 2),
    document.querySelector("#yellownest" + 3),
    document.querySelector("#yellownest" + 4)
];
const pluppar = []
for (var i = 0; i < 40; i++) {
    pluppar[i] = document.querySelector("#plupp" + i);
    pluppar[i].onclick = function() {getSquareValue(this.id)};
}
const squareValues = [
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0]
]

var moveUnit = false;
var playerTurnColors = ["#e60202","#73ccff","#64fc3a","#f9fc26"]
var playerTurnColorsInString = ["red","blue","green","yellow"]
var firstTimeRerolls = [3,3,3,3];
var reRollOnSix = false;
var unitsOnBoard = [0,0,0,0];
var unitsInGoal = [0,0,0,0];
var unitsInNest = [4,4,4,4];
var playerturn;
var startingPlayer;
var rollingForHighestPlayerTurn = 0;
var player = [];
var rollingForGame = false;
var rollingForHighest = false;
var playerRolls = [0,0,0,0];
var playerAmmount;
var allowRoll = false;
var announceInputInteger;
var diceFace = 0;
var walkChoice = false;
var excreteChoice = false;
var excreteOne1 = false;
var excreteOne6 = false;
var excreteTwo1 = false;
var pluppId;
var nextSquare;

startGame();

function startGame() {
    collectPlayerAmmount();
}

function checkPossibleMoves() {
    if (unitsOnBoard[playerturn] > 0) {playerWalkButtonElement.style.background = "green"; walkChoice = true;}
    else {playerWalkButtonElement.style.background = "red"; walkChoice = false;}

    if (unitsInNest[playerturn] > 0 && ((diceFace+1) == 1 || (diceFace+1) == 6)) {
        playerExcreteButtonElement.style.background = "green";
        excreteChoice = true;
    }
    else {playerExcreteButtonElement.style.background = "red"; excreteChoice = false;}

    if (firstTimeRerolls[playerturn] > 0 && walkChoice == false && excreteChoice == false) {
        firstTimeRerolls[playerturn] -= 1;
        console.log("allowing reroll, allowRoll=" + allowRoll + ", firsttimerolls remaining = " + firstTimeRerolls[playerturn]);
        if(firstTimeRerolls[playerturn] > 0) {allowRoll = true;}
        else if(walkChoice == false && excreteChoice == false) {selectNextPlayer();}
    }
    
    if(firstTimeRerolls[playerturn] < 1 && walkChoice == false && excreteChoice == false) {
        selectNextPlayer();
    }
}

function excreteButtonClick() {
    if(excreteChoice) {
        if (excreteOne6) {
            unitsOnBoard[playerturn] += 1;
            unitsInNest[playerturn] -= 1;
            displayOnePluppAtSixthForPlayer(playerturn);
            console.log("Excreting one unit at sixth square");
            excreteOne6 = false;
            excreteTwo1 = false;
            excreteChoice = false;  
            selectNextPlayer(); 
        }

        if(excreteChoice && (diceFace+1) == 1) {
            excreteOne1 = true;
            unitsOnBoard[playerturn] += 1;
            unitsInNest[playerturn] -= 1;
            displayOnePluppAtFirstForPlayer(playerturn);
            console.log("Excreting one unit at first square");
            excreteOne1 = false;
            excreteChoice = false;
            selectNextPlayer();
        }

        if(excreteChoice && (diceFace+1) == 6) {
            excreteOne6 = true;
            if (unitsInNest[playerturn] > 1) {excreteTwo1 = true;}
            playerWalkButtonElement.style.background = "green";
            playerWalkButtonElement.innerHTML = "Excrete 2 units at first square";
            playerExcreteButtonElement.innerHTML = "Excrete 1 unit at sixth square";
        }
    }
}

function moveButtonClick() {
    if(excreteTwo1) {
        unitsOnBoard[playerturn] += 2;
        unitsInNest[playerturn] -= 2;
        displayTwoPluppAtFirstForPlayer(playerturn);
        console.log("Excreting two units at first square");
        excreteOne6 = false;
        excreteTwo1 = false;
        excreteChoice = false; 
        selectNextPlayer();
    }
    if (walkChoice && !excreteTwo1) {
        for (var i = 0; i < 40; i++) {
            if (squareValues[i][1] > 0 && squareValues[i][0] == (playerturn+1)) {
                pluppar[i].style.background = "white";
            }
        }
        console.log("walking dice ammount forward...");
        walkChoice = false;
        moveUnit = true;
    }
}

function getSquareValue(id) {
    pluppId = parseInt(id.slice(5));
    var matchingId = false;
    for (var i = 0; i <39; i++) {
        if (squareValues[pluppId][0] == (playerturn+1)) {
            matchingId = true;
        }
    }
    if (moveUnit && matchingId) {
        nextSquare = (pluppId+diceFace+1);
        if(nextSquare > 39) {nextSquare -= 40;}


        if(squareValues[pluppId][1] == 1) {
            squareValues[pluppId][0] = 0; 
            squareValues[pluppId][1] = 0; 
            pluppar[pluppId].style.background = "none";
            pluppar[pluppId].innerHTML = "";
            pluppar[pluppId].style.border = "none";
        }
        else {squareValues[pluppId][1] -= 1; pluppar[pluppId].innerHTML = squareValues[pluppId][1];}       
        
        if(squareValues[nextSquare][1] == 0) {
        squareValues[nextSquare][1] += 1;
        squareValues[nextSquare][0] = (playerturn+1);
        pluppar[nextSquare].innerHTML = "1";
        pluppar[nextSquare].style.border = "9px rgb(26, 26, 26) solid";
        pluppar[nextSquare].style.background = playerTurnColors[playerturn];
        
        }
        else if (squareValues[nextSquare][1] > 0 && squareValues[nextSquare][0] != playerturn+1) {
            unitsInNest[(squareValues[nextSquare][0])-1] += squareValues[nextSquare][1];
            squareValues[nextSquare][1] = 1;
            squareValues[nextSquare][0] = (playerturn+1);
            pluppar[nextSquare].innerHTML = "1";
            pluppar[nextSquare].style.border = "9px rgb(26, 26, 26) solid";
            pluppar[nextSquare].style.background = playerTurnColors[playerturn];
        }
        else {
            squareValues[nextSquare][1] += 1;
            squareValues[nextSquare][0] = (playerturn+1);
            pluppar[nextSquare].innerHTML = squareValues[nextSquare][1];
        }
        console.log(squareValues);
        moveUnit = false;
        for (var i = 0; i < 40; i++) {
            if (squareValues[i][1] > 0 && squareValues[i][0] == (playerturn+1)) {
                pluppar[i].style.background = playerTurnColors[playerturn];
            }
        }
        addNestUnits((squareValues[nextSquare][0])-1);
        selectNextPlayer();
    }
}

function displayOnePluppAtFirstForPlayer(x) {
    if (squareValues[0 + (x * 10)][1] < 1) {
        pluppar[0 + (x * 10)].style.background = playerTurnColors[x];
        pluppar[0 + (x * 10)].style.border = "9px rgb(26, 26, 26) solid";
        pluppar[0 + (x * 10)].innerHTML = "1";
        squareValues[0 + (x * 10)][1] = 1;
        squareValues[0 + (x * 10)][0] = playerturn+1;
    }
    else if (squareValues[0 + (x * 10)][1] > 0 && squareValues[0 + (x * 10)][0] == playerturn+1) {
        squareValues[0 + (x * 10)][1] += 1;
        pluppar[0 + (x * 10)].innerHTML = squareValues[0 + (x * 10)][1];
    }

    removeNestUnits();
}

function displayOnePluppAtSixthForPlayer(x) {
    if (squareValues[5 + (x * 10)][1] < 1) {
        pluppar[5 + (x * 10)].style.background = playerTurnColors[x];
        pluppar[5 + (x * 10)].style.border = "9px rgb(26, 26, 26) solid";
        pluppar[5 + (x * 10)].innerHTML = "1";
        squareValues[5 + (x * 10)][1] = 1;
        squareValues[5 + (x * 10)][0] = playerturn+1;
    }
    else if (squareValues[5 + (x * 10)][1] > 0 && squareValues[0 + (x * 10)][0] == playerturn+1) {
        squareValues[5 + (x * 10)][1] += 1;
        pluppar[5 + (x * 10)].innerHTML = squareValues[0 + (x * 10)][1];
    }
    removeNestUnits();
}

function displayTwoPluppAtFirstForPlayer(x) {
    if (squareValues[0 + (x * 10)][1] < 1) {
        pluppar[0 + (x * 10)].style.background = playerTurnColors[x];
        pluppar[0 + (x * 10)].style.border = "9px rgb(26, 26, 26) solid";
        pluppar[0 + (x * 10)].innerHTML = "2";
        squareValues[0 + (x * 10)][1] = 2;
        squareValues[0 + (x * 10)][0] = playerturn+1;
    }
    else if(squareValues[0 + (x * 10)][1] > 0 && squareValues[0 + (x * 10)][0] == playerturn+1) {
        squareValues[0 + (x * 10)][1] += 2;
        pluppar[0 + (x * 10)].innerHTML = squareValues[0 + (x * 10)][1];
    }

    removeNestUnits();
}

function removeNestUnits() {
        for(var i = (4 - unitsInNest[playerturn]); i > 0; i--) {
            nestUnitElementIds[i  + (playerturn*4 - 1 )].style.display = "none";
        }
}

function addNestUnits(playerId) {
        for(var i = (unitsInNest[playerId]); i > 0; i--) {
            nestUnitElementIds[((playerId+1)*4 + 4) - i].style.display = "flex";
            console.log("Revealing Nest Units, " + unitsInNest[playerId+1] + " of them. Belonging to " + playerTurnColorsInString[playerId+1]);
    }
}

function selectNextPlayer() {
    if(playerAmmount == 4) {
        if(playerturn < 3) {
            playerturn++;
        }
        else {playerturn = 0;}
    }
    playerWalkButtonElement.style.background = "red";
    playerExcreteButtonElement.style.background = "red";
    playerTurnBoxElement.style.background = playerTurnColors[playerturn];
    playerTurnBoxElement.innerHTML = capitalizeFirstLetter(player[playerturn]) + "'s turn";
    playerWalkButtonElement.innerHTML = "Walk Forward";
    playerExcreteButtonElement.innerHTML = "Excrete Unit";
    allowRoll = true;
}

function selectStartingPlayer() {
    var higestRoll=0;
    for(var i = 0; i <4; i++) {
        if(playerRolls[i] > higestRoll) {higestRoll = playerRolls[i]; startingPlayer = i;}
    }
    announceAreaText.innerHTML = "Player " + player[rollingForHighestPlayerTurn-1] + " rolled a " + (diceFace+1) + ".     Player " + player[startingPlayer] + " rolled the higest! Please begin the game." ;
    announceArea.style.display = "flex";
    rollingForGame = true;
    playerTurnBoxElement.innerHTML = capitalizeFirstLetter(player[startingPlayer]) + "'s turn";
    playerTurnBoxElement.style.background = playerTurnColors[startingPlayer];
    playerturn = startingPlayer;
}

function rollForStartingPlayer() {
    console.log("Rolling for starting player...");
    announceAreaText.innerHTML = "Red! Please roll for the dice, higest roll starts the game."
    announceAreaInput.style.display = "none";
    announceArea.style.display = "flex";
    allowRoll = true;
    rollingForHighest = true;
}

function displayPlayers() {
    if (playerAmmount == 2) {
        console.log("displaying 2 player game");
        for(var i = 0; i < 4; i++) {nestUnitElementIds[i].style.display = "flex"; } 
        for(var i = 8; i < 12; i++) {nestUnitElementIds[i].style.display = "flex"; }
    }
    if (playerAmmount == 3) {
        console.log("displaying 3 player game");
        for(var i = 0; i < 4; i++) {nestUnitElementIds[i].style.display = "flex"; } 
        for(var i = 8; i < 16; i++) {nestUnitElementIds[i].style.display = "flex"; }
    }
    if (playerAmmount == 4) {
        console.log("displaying 4 player game");
        for(var i = 0; i < 16; i++) {nestUnitElementIds[i].style.display = "flex"; } 
    }
    rollForStartingPlayer();
}

function setPlayerAmmount(x) {
    playerAmmount = x;
    if(x == 4) {player = ["red","blue","green","yellow"];}
    if(x == 3) {player = ["red","green","yellow"];}
    if(x == 2) {player = ["red","green"];}
}

function collectPlayerAmmount() {
    announceAreaInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            announceInputInteger = announceAreaInput.value;
            if(announceInputInteger > 1 && announceInputInteger < 5) {announceArea.style.display = "none"; setPlayerAmmount(announceInputInteger); displayPlayers();}
            else {announceAreaText.innerHTML = "Invalid ammount of players! Try again"}
        }
    });
}

function rolldice() {
    if (allowRoll) {
    allowRoll = false;
    var x = 0;
    var rollloop = setInterval(() => {
        diceDiv.style.transform = "rotate("+x+"deg)";
        x += 30
        if(x > 720) {
            clearInterval(rollloop);
            diceFaceElements[diceFace].style.display = "none";
            diceFace = Math.floor(Math.random() * 6);
            diceFaceElements[diceFace].style.display = "grid";

            if(rollingForGame && !rollingForHighest) {
                allowRoll = false;
                if(firstTimeRerolls[startingPlayer] > 0 && ((diceFace+1) == 1 || (diceFace+1) == 6)) {
                    firstTimeRerolls[startingPlayer] = 0;
                }
                checkPossibleMoves();
            }

            if(rollingForGame && rollingForHighest) {
                rollingForHighest = false;
                announceArea.style.display = "none";
                checkPossibleMoves();
            }   

            if (rollingForHighest && playerAmmount == 4) {

                playerRolls[rollingForHighestPlayerTurn] = diceFace;
                announceAreaText.innerHTML = "Player " + player[rollingForHighestPlayerTurn] + " rolled a " + (diceFace+1) + ". " + player[rollingForHighestPlayerTurn+1] + " please roll the dice.";
                console.log("player - " + player[rollingForHighestPlayerTurn] + " - rolled a dice value of: " + (diceFace+1));
                console.log("var rollingForHighestPlayerTurn = " + rollingForHighestPlayerTurn);
                rollingForHighestPlayerTurn++;
                allowRoll = true;

                if(rollingForHighestPlayerTurn == playerAmmount) {
                    selectStartingPlayer();
                }
            }

            
        }
    }, 1);
    
    }
    else {console.log("Roll failed!");}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }