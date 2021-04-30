class Requests{

    constructor(){
        this.NICK = "";
    }

    static PAWNS = null;

    static SERVER_ADDRESS = ''; //'https://gacek-chinol.herokuapp.com/';


    static listeners(){

        document.getElementById("LOGIN-FORM").addEventListener('submit', (e) => {

            let data = { nick: this.NICK };

            console.log(data.nick);

            if(data.nick){
                fetch(Requests.SERVER_ADDRESS + 'start', {
        
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
            
                    body: JSON.stringify(data),
            
                }).then(response => response.json())
            }
            else{
                document.getElementById('bad-login').innerText = "Nie możesz być pustym ciągiem, chyba nie czujesz się nikim? :)"
            }
        
            
        });
        
        
        document.getElementsByName("nick")[0].addEventListener('change', (e) => { this.NICK = e.target.value; });
    }


    static askForGame(){

        fetch(Requests.SERVER_ADDRESS + 'gameState', { method: 'GET', headers: {'Content-Type': 'application/json'} }).then(response => response.json()).then(data => {

            let state = data.started;
            let players = data.players;
            

            console.log(data);

            for(let i=0; i<4; i++){ 
                let ID = "U" + (i + 1);
                document.getElementById(ID).innerText = '';
            }

            for(let i=0; i<players.length; i++){

                let ID = "U" + (i + 1);
                document.getElementById(ID).innerText = players[i];
            }



            if(state){

                document.getElementById('status').style.display = 'none';

                if(players.length < 2) Requests.resetMe();        
                else{
                    let boxes = document.getElementsByClassName('user-box');

                    let toffset = 170 * (data.active_player + 1);

                    document.getElementById('timer').style.left = toffset;

                    timeSync(data.time);

                    boxes[0].classList.add('ured');
                    boxes[1].classList.add('uyellow');
                    boxes[2].classList.add('ugreen');
                    boxes[3].classList.add('ublue');

                    if(data.moving) document.getElementsByClassName('dice-box')[0].style.display = 'flex';                   
                    else document.getElementsByClassName('dice-box')[0].style.display = 'none';
                }
            }
            else if(data.reset) Requests.resetMe();  
            else if(data.winner) Requests.winner();
        
        });

    }


    static resetMe(){ window.location.href = Requests.SERVER_ADDRESS + "resetMe"; }

    static winner(){ window.location.href = Requests.SERVER_ADDRESS + "winner"; }

    static whoWon(){

        fetch( Requests.SERVER_ADDRESS + 'winnerInfo', { method: 'GET', headers: {'Content-Type': 'application/json'} }).then(response => response.json()).then(data => {

                let winID = data.winner;

                let colors = ['Czerwony', 'Żółty', 'Zielony', 'Niebieski'];

                document.getElementById('err').innerText = "ZWYCIĘŻYŁ " + colors[winID] + "!!!";
        });
    }


    static ready(info){

            let data = { toggle: info };
        
            fetch(Requests.SERVER_ADDRESS + 'ready', {
        
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
        
                body: JSON.stringify(data),
        
            }).then(response => response.json())
            .then(data => {    
                
                if(data.ready){

                    let boxes = document.getElementsByClassName('user-box');

                    boxes[0].classList.add('ured');
                    boxes[1].classList.add('uyellow');
                    boxes[2].classList.add('ugreen');
                    boxes[3].classList.add('ublue');
                }

            });            
    }

    static getRandomMove(){
        
        fetch(Requests.SERVER_ADDRESS + 'makeMove', { method: 'GET', headers: {'Content-Type': 'application/json'} }).then(response => response.json()).then(data => {

            Requests.PAWNS = data;

            let img = '../imgs/dice/d' + data.dice + ".png";

            document.getElementsByClassName('dice-box')[0].innerHTML = '<img id="dice" src="../imgs/dice/d1.png" />';
            document.getElementById('dice').src = img;

            let possible_moves = 0;

            for(let i=0; i<4; i++) possible_moves += data.pawns[i].move;

            Speach.speak(data.dice);

            if(possible_moves == 0) Requests.sendPawnMove(0);           
        });

    }

    static getPawnData(){ return Requests.PAWNS; }


    static sendPawnMove(pawn){

        Requests.PAWNS = null;

        let data = {pawn: pawn};

        document.getElementsByClassName('dice-box')[0].style.display = 'none';

        document.getElementsByClassName('dice-box')[0].innerHTML = '<img id="dice" src="../imgs/dice/d1.png" /> Losuj!';

        fetch(Requests.SERVER_ADDRESS + 'selectedPawn', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
        
            body: JSON.stringify(data),
        });
    }


    static dice(callback){

        fetch(Requests.SERVER_ADDRESS + 'dice', { method: 'GET', headers: {'Content-Type': 'application/json'} }).then(response => response.json()).then(data => {

            if(data.throw) callback();
        });

    }


    static boardState(){

        fetch(Requests.SERVER_ADDRESS + 'boardState', { method: 'GET', headers: {'Content-Type': 'application/json'} }).then(response => response.json()).then(data => {

            let all_pawns = data.board_state;

            for(let i=0; i<all_pawns.length; i++){

                for(let j=0; j<all_pawns[i].length; j++){

                    let ID = 'P' + i + j;

                    Pawns.setPawn(i, ID, all_pawns[i][j].distance);
                }
            }

        });
    }
}


