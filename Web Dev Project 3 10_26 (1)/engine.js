//Global variables
var playerStrength, playerSpeed, playerCunning, playerFatigue;
var compStrength, compSpeed, compCunning, compFatigue;

var currentPStrength, currentPSpeed, currentPCunning, currentPFatigue;
var currentCStrength, currentCSpeed, currentCCunning, currentCFatigue;

var playerBlocking = false;
var playerAttacking = false;
var playerFinishing = false;
var compBlocking = false;
var compAttacking = false;
var compFinishing = false;

var youWon;


function randomInt(lower, upper){
	//R= parseInt(rnd * (upper - (lower - 1)) + lower
	var multiplier = upper - (lower - 1);
	var rand = parseInt(Math.random() * multiplier) + lower;
	
	return rand;
}

function initialize(){
    document.getElementById("finisher").style.visibility="hidden";
    generateFighters();
    setText();
    checkFinish();
    // document.getElementById("battlefield").addEventListener("mouseover",function(){currentCCunning++;currentPFatigue++;});
}

function generateFighters(){
    //Increase strength and speed for player, cunning and fatigue for comp
    playerStrength = 6 + randomInt(0,1);
    playerSpeed = 6 + randomInt(0,1);
    playerCunning = 6 - randomInt(0,1);
    playerFatigue = 30 - randomInt(0,6);

    compStrength = 6 - randomInt(0,1);
    compSpeed = 6 - randomInt(0,1);
    compCunning = 6 + randomInt(0,1);
    compFatigue = 30 + randomInt(0,6);

    currentPStrength = playerStrength;
    currentPSpeed = playerSpeed;
    currentPCunning = playerCunning;
    currentPFatigue = playerFatigue;

    currentCStrength = compStrength;
    currentCSpeed = compSpeed;
    currentCCunning = compCunning;
    currentCFatigue = compFatigue;
}

function setText(){
    document.getElementById("ogPlayerText").innerHTML = `Player Strength: ${playerStrength} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentPStrength} <br/>
     Player Speed: ${playerSpeed} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentPSpeed} <br/> 
     Player Cunning: ${playerCunning} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentPCunning} <br/> 
     Player Fatigue: ${playerFatigue} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentPFatigue} `;

    document.getElementById("ogEnemyText").innerHTML = `CPU Strength: ${compStrength} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentCStrength} <br/> 
    CPU Speed: ${compSpeed} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentCSpeed} <br/> 
    CPU Cunning: ${compCunning} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentCCunning} <br/> 
    CPU Fatigue: ${compFatigue} &nbsp;&nbsp;&nbsp;&nbsp; Currently: ${currentCFatigue} `;
}

function chooseMove(text){
    if(text === 'attack'){
        compChooseMove();
        playerAttack();
        console.log("attack!!");
    }else if(text === 'defend'){
        playerBlocking = true;
        compChooseMove();
        if(playerBlocking && compBlocking){
            currentPFatigue += randomInt(1,6);
            currentCFatigue += randomInt(1,6);
            console.log("heal!!");
        }
        console.log("defend!!");
    }else if(text === 'finish'){
        compChooseMove();
        playerFinish();
    }else if(text === 'pass'){
        compChooseMove();
        addMove('Didnt move','Moved');
    }
    setText();
    if(playerFinishing){
        if(compAttacking){
            addMove('Finisher','Attack');
        }else if(compBlocking){
            addMove('Finisher','Defend');
        }
    }else{
        if(playerAttacking){
            if(compAttacking){
                addMove('Attack','Attack');
            }else if(compBlocking){
                addMove('Attack','Defend');
            }
        }else if(playerBlocking){
            if(compAttacking){
                addMove('Defend','Attack');
            }else if(compBlocking){
                addMove('Defend','Defend');
            }
        }
    }
    checkFinish();
    compAttacking = false;
    compBlocking = false;
    playerBlocking = false;
    playerAttacking = false;
    playerFinishing = false;
}

function compChooseMove(){
    //Prioritize finishing move over attacking or defending
    let finish = ((currentPFatigue < 0) || (currentCFatigue >= (2 * currentPFatigue)));
    if(finish){
        compFinish();
    }else{
        let coinFlip = randomInt(0,1);
        if(coinFlip === 0){
            compAttacking = true;
        }else{
            compBlocking = true;
        }
        if(compAttacking){
            compAttack();
        }
    }
}

function playerAttack(){
    playerAttacking = true;
    let defenseValue = compBlocking ? (currentCSpeed + currentCCunning) : (currentCSpeed + randomInt(1,6));
    let attackValue = (currentPSpeed + currentPStrength + currentPCunning) / randomInt(1,3);
    if(attackValue > defenseValue){
        let damage = Math.round(attackValue - defenseValue);
        currentCFatigue -= damage;
        console.log("You did " + damage + " damage!");
    }else if(compBlocking){
        currentCFatigue += randomInt(1,6);
    }
}

function playerFinish(){
    playerAttacking = true;
    playerFinishing = true;
    let defenseValue = compBlocking ? (currentCSpeed + currentCCunning) : (currentCSpeed + randomInt(1,6));
    let attackValue = (currentPSpeed + currentPStrength) / randomInt(1,3);
    if(attackValue > defenseValue){
        console.log("You win!");
        currentCFatigue = 0;
        youWon = true;
        gameOver();
    }else{
        console.log("Finisher failed");
    }
}

function compFinish(){
    console.log("Enemy finisher incoming!");
    compAttacking = true;
    compFinishing = true;
    let defenseValue = playerBlocking ? (currentPSpeed + currentPCunning) : (currentPSpeed + randomInt(1,6));
    let attackValue = (currentCSpeed + currentCStrength) / randomInt(1,3);
    if(attackValue > defenseValue){
        console.log("You lose!");
        currentPFatigue = 0;
        youWon = false;
        gameOver();
    }else{
        console.log("CPU Finisher failed");
    }
}

function compAttack(){
    let defenseValue = playerBlocking ? (currentPSpeed + currentPCunning) : (currentPSpeed + randomInt(1,6));
    let attackValue = (currentCSpeed + currentCStrength + currentCCunning) / randomInt(1,3);
    if(attackValue > defenseValue){
        let damage = Math.round(attackValue - defenseValue);
        currentPFatigue -= damage;
        console.log("CPU did " + damage + " damage!");
    }else if(playerBlocking){
        currentPFatigue+=randomInt(1,6);
    }
}

function addMove(ptext, ctext){
    var table = document.getElementById("movetable");
    var row = table.insertRow(1);
    var playerCell = row.insertCell(0);
    var compCell = row.insertCell(1);
    playerCell.innerHTML = ptext;
    compCell.innerHTML = ctext;
}

function checkFinish(){
    let finish = ((currentCFatigue < 0) || (currentPFatigue >= (2 * currentCFatigue)));
    if(finish){
        document.getElementById("finisher").style.visibility = "visible";
        console.log("finisher ready!");
    }else{
        document.getElementById("finisher").style.visibility = "hidden";
    }
}

function finishHim(){
    console.log("I'm dead");
}

test => compFatigue -8;

function gameOver(){
    let buttons = document.querySelectorAll("button");
    for(let i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
    }
    if(youWon){
        document.getElementById("battleLog").innerHTML = "Congrats!";
    }else{
        document.getElementById("battleLog").innerHTML = "Womp womp";
    }
}