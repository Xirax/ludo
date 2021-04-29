
var boardHandler = new Board();
var pawnHandler = new Pawns();

var colors = ['transparent', 'white', 'red', 'blue', 'green', 'yellow', ' #ff5c33', '#4db8ff', '#5cd65c', '#ffff66'];

var board = [

    [2 , 2 , 0 , 0 , 1 , 1 , 7 , 0 , 0 , 3 , 3],    // R1
    [2 , 2 , 0 , 0 , 1 , 3 , 1 , 0 , 0 , 3 , 3],    // R2
    [0 , 0 , 0 , 0 , 1 , 3 , 1 , 0 , 0 , 0 , 0],    // R3
    [0 , 0 , 0 , 0 , 1 , 3 , 1 , 0 , 0 , 0 , 0],    // R4
    [6 , 1 , 1 , 1 , 1 , 3 , 1 , 1 , 1 , 1 , 1],    // R5
    [1 , 2 , 2 , 2 , 2 , 0 , 4 , 4 , 4 , 4 , 1],    // R6
    [1 , 1 , 1 , 1 , 1 , 5 , 1 , 1 , 1 , 1 , 8],    // R7
    [0 , 0 , 0 , 0 , 1 , 5 , 1 , 0 , 0 , 0 , 0],    // R8
    [0 , 0 , 0 , 0 , 1 , 5 , 1 , 0 , 0 , 0 , 0],    // R9
    [5 , 5 , 0 , 0 , 1 , 5 , 1 , 0 , 0 , 4 , 4],    // R10
    [5 , 5 , 0 , 0 , 9 , 1 , 1 , 0 , 0 , 4 , 4],    // R11
    
];

var dice_spinning = false;

function initGame(){

    boardHandler.drawBoard(board, 25, colors);

    pawnHandler.initPawns();
    pawnHandler.setPawnsOnBoard();
}


function throwPrepare(){ console.log("YES!"); if(!dice_spinning) Requests.dice(throwDice); }

function blockThrow() { console.log("Are you trying to cheat?"); }


function throwDice(itr=0, rot=0){

        dice_spinning = true;
        
        setTimeout(() => {

            if(itr < 30){

                let shown = Math.floor(Math.random() * 5) + 1;

                let src = "../imgs/dice/d" + shown + ".png";

                rot += 50;

                document.getElementById('dice').src = src;
                document.getElementById('dice').style.transform = 'rotate(' + rot + 'deg)';

                itr++;
                throwDice(itr, rot);
            }
            else{

                document.getElementById('dice').style.transform = 'rotate(0deg)';
                Requests.getRandomMove();


                dice_spinning = false;
            }

        }, 45 + (itr * 2));
}



function pawnPossibleMove(ID) { pawnHandler.pawnPossibleMove(ID); }

function cursorRemove(){ document.getElementById('cursor-pawn').style.display = 'none'; }


function sendMove(ID){  pawnHandler.movePawn(ID); }


function timeSync(t){ 
    
    if(t >= 0) document.getElementById('timer').innerText = t; 
    healTimeSpace(t);
}

function healTimeSpace(t){

    setTimeout(() =>{
        t -= 1;
        if(t >= 0) document.getElementById('timer').innerText = t; 
    }, 1000);
}






