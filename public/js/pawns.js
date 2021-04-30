

class Pawns {

    constructor(){
        this.pawns = [],
        this.docks = [
            {x: 0, y: 0},
            {x: 9, y: 0},
            {x: 9, y: 9},
            {x: 0, y: 9}
        ],

        this.offsets = [
            {x: 4, y:0},
            {x: 10, y:4},
            {x: 6, y:10},
            {x: 6, y:0}
        ]
    }


    initPawns(){
        for(let i=0; i<4; i++) this.dockColor(this.docks[i], i+2);     
    }



    dockColor(dock, ID){

        for(let i=0; i<2; i++) for(let j=0; j<2; j++) this.pawns.push({color: ID, position: {x: dock.x + i, y: dock.y + j}, drawer: null});      
    }


    setPawnsOnBoard(){

        for(let i=0; i<this.pawns.length; i++){


            let imgN = "p" + this.pawns[i].color + ".png";

            let ID = "P" + (this.pawns[i].color-2) + (i % 4);

            let html_pawn = '<div onclick="sendMove(\'' + ID + '\')" onmouseover="pawnPossibleMove(\'' + ID + '\')" onmouseout="cursorRemove()" class="P" id="' + ID + '"><img src="../imgs/pawns/' + imgN + '" /> </div>';

            document.getElementById('pawns').innerHTML += html_pawn;


            let pawn = document.getElementById(ID);

            pawn.style.top = this.pawns[i].position.y * 62 + 30;
            pawn.style.left = this.pawns[i].position.x * 62 + 30;
        }


    }


    pawnPossibleMove(ID){

        let pawn_data = Requests.getPawnData();

        if(pawn_data != null){

            let color = ID[1];
            let pawn = ID[2];

            if(color == pawn_data.color){

                if(pawn_data.pawns[pawn].move > 0){

                    let posAfter = pawn_data.pawns[pawn].distance + pawn_data.pawns[pawn].move;

                    posAfter -= 1;
    
                    let offsets = [0, 10, 20, 30];
    
                    posAfter += offsets[color];
    
                    let newPos = Pawns.anchor(posAfter, color);
    
                    let cpawn = document.getElementById('cursor-pawn');
    
                    let clr_fixed = Number(color) + 2;
    
                    let imgN = "p" + clr_fixed + "blink.png";
    
                    let img = '<img src="../imgs/pawns/' + imgN + '" />';
    
                    cpawn.style.display = 'inline-block';
                    cpawn.style.top = newPos.y * 62 + 30;
                    cpawn.style.left = newPos.x * 62 + 30;
                    cpawn.innerHTML = img;
                }
            }
        }

    }


    movePawn(ID){

        let pawn_data = Requests.getPawnData();

        if(pawn_data != null){
            let color = ID[1];
            let pawn = ID[2];
    
            if(color == pawn_data.color && pawn_data.pawns[pawn].move > 0){
    
                let pawn_moved = document.getElementById(ID);
    
                pawn_moved.style.top = document.getElementById('cursor-pawn').style.top;
                pawn_moved.style.left = document.getElementById('cursor-pawn').style.left;
    
                Requests.sendPawnMove(pawn); 
            }  
        }
    }


    static translatePos(obj, val){

        let inc = 0;

        if(obj.pos > 0){
            if(obj.pos > Math.abs(val)){ inc = val; obj.pos -= Math.abs(val); }
            else { 
                if(val < 0) inc = -obj.pos; 
                else inc = obj.pos;
                
                obj.pos = 0; 
            }

            return inc;
        }
        else return 0;
    }

    static anchor(pos, c){

        let newPos = { x: 4, y: 0};

        let mat = {pos: pos};

        let limit = 40 + (c * 10);

        if(mat.pos < limit){
            while(mat.pos > 0){
                newPos.x += Pawns.translatePos(mat, 2);
                newPos.y += Pawns.translatePos(mat, 4);
                newPos.x += Pawns.translatePos(mat, 4);
                newPos.y += Pawns.translatePos(mat, 2);
                newPos.x += Pawns.translatePos(mat, -4);
                newPos.y += Pawns.translatePos(mat, 4);
                newPos.x += Pawns.translatePos(mat, -2);
                newPos.y += Pawns.translatePos(mat, -4);
                newPos.x += Pawns.translatePos(mat, -4);
                newPos.y += Pawns.translatePos(mat, -2);
                newPos.x += Pawns.translatePos(mat, 4);
                newPos.y += Pawns.translatePos(mat, -4);
            }
        }
        else{
            let docks = [
                {x: 5, y: 1, axis: 'y', dir: 1},
                {x: 9, y: 5, axis: 'x', dir: -1},
                {x: 5, y: 9, axis: 'y', dir: -1},
                {x: 1, y: 5, axis: 'x', dir: 1}
            ]

            newPos.x = docks[c].x;
            newPos.y = docks[c].y;

            for(let i=40; i<mat.pos - (c * 10); i++){

                if(docks[c].axis == 'x') newPos.x += docks[c].dir;
                else newPos.y += docks[c].dir;
            }
        }

        return newPos;
    }

    static setPawn(col, ID, pos){

        if(pos > 0){

            pos -= 1;

            let offsets = [0, 10, 20, 30];

            pos += offsets[col];

            let newPos = Pawns.anchor(pos, col);
            
            let pawn_to_set = document.getElementById(ID);
    
            pawn_to_set.style.top = newPos.y * 62 + 30;
            pawn_to_set.style.left = newPos.x * 62 + 30;
        }
        else{

            let place = ID[2];

            let docks = [
                {x: 0, y: 0},
                {x: 9, y: 0},
                {x: 9, y: 9},
                {x: 0, y: 9}
            ];

            let newPos = docks[col];

            if(place == 1) newPos.x += 1;
            else if(place == 2) newPos.y += 1;
            else if(place == 3){ newPos.x += 1; newPos.y += 1; }

            let pawn_to_set = document.getElementById(ID);
    
            pawn_to_set.style.top = newPos.y * 62 + 30;
            pawn_to_set.style.left = newPos.x * 62 + 30;
        }  
    }
}