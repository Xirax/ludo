
var toggle = false;

function login(){ Requests.listeners(); }


function game() { 
    
    setTimeout(() => { game(); }, 2000);

    Requests.askForGame(); 
}


function redraw(){

    setTimeout(() => { redraw(); }, 2000);

    Requests.boardState();
}

function searchForWin(){ Requests.whoWon(); }


function toggleSwitch(){

    toggle = !toggle;

    Requests.ready(toggle);

    if(toggle){
        document.getElementById("status").innerText = "Poczekam jeszcze";

        document.getElementById("status").classList.remove("sunactive");
        document.getElementById("status").classList.add("sactive");
    }
    else{
        document.getElementById("status").innerText = "Chcę już grać!";

        document.getElementById("status").classList.remove("sactive");
        document.getElementById("status").classList.add("sunactive");
    }
}



