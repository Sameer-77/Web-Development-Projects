let gameSeq = [];
let userSeq = [];

let btns = ["red","yellow","purple","green"];

let started = false;
let level = 0;


let h2 = document.querySelector("h2");

document.addEventListener("keypress", function() {
    if(started == false){
        started = true;
        
        levelUp();
    }
});


function gameFlash(btn){
    btn.classList.add("flash");

    setTimeout(function (){
        btn.classList.remove("flash");
    },250);
}

function userFlash(btn){
    btn.classList.add("userFlash");

    setTimeout(function (){
        btn.classList.remove("userFlash");
    },250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;


    //CHOOSE RANDOM BUTTON
    let randIndex = Math.floor(Math.random()*3);
    let randColor = btns[randIndex];
    let randBtn = document.querySelector(`.${randColor}`);  
    // console.log(randBtn);
    // console.log(randColor);
    // console.log(randIndex);
    gameSeq.push(randColor);
    gameFlash(randBtn);
}


// function checkAns(index){
//     let idx = level-1;

//     if(userSeq[idx] === gameSeq[idx]){
//         if(userSeq.length == gameSeq.length){
//             setTimeout(levelUp,1000);
//         }
//     }
//     else{
//         h2.innerText = `Game over..!! Press any key to start again`;
//     }
// }


function checkAns(index) {
    if (userSeq[index] === gameSeq[index]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        h2.innerHTML = `Game over..!! Your score was : <b>${level}</b> <br>Press any key to start again`;
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor="white";
        },150);
        reset();
    }
}




function btnPress(){  
    let btnPressed = this;
    userFlash(btnPressed);

    userColor = btnPressed.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");

for(btn of allBtns){
    btn.addEventListener("click", btnPress);
}



function reset() {
    started=false;
    userSeq = [];
    gameSeq = [];
    level=0;
}