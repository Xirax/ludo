
function clamp(n, min, max){

    if(n < min) n = min;
    if(n > max) n = max;

    return n;
}



class Board {

    constructor(){
        this.pawns = [];
    }


    drawBoard(board, CIRCLE_SIZE, colors){

        let P = CIRCLE_SIZE * 2;
        let SPACE = 12;

        let html_board = document.getElementById('game-board');

        html_board.width = CIRCLE_SIZE * 24 + SPACE * 12;
        html_board.height = CIRCLE_SIZE * 24 + SPACE * 12;

        let drawer = html_board.getContext('2d');




        for(let i=0; i<board.length; i++){

            for(let j=0; j<board[i].length; j++){

                if(board[i][j] == 0) continue;

                drawer.beginPath();
                drawer.arc(i*P+P+SPACE*i, j*P+P+SPACE*j, CIRCLE_SIZE, 0, 2 * Math.PI);
                drawer.fillStyle = colors[board[i][j]];
                drawer.fill();
                drawer.stroke();


                if(board[i][j] != 2 && board[i][j] != 3 && board[i][j] != 4 && board[i][j] != 5){
                    
                    if(j < board[i].length - 1){

                        if(board[i][j+1] != 2 && board[i][j+1] != 3 && board[i][j+1] != 4 && board[i][j+1] != 5 && board[i][j+1] != 0){

                            drawer.beginPath();
                            drawer.moveTo(i*P+P+SPACE*i, j*P+P+SPACE*j+CIRCLE_SIZE)
                            drawer.lineTo(i*P+P+SPACE*i, j*P+P+SPACE*j+CIRCLE_SIZE+SPACE);
                            drawer.stroke();
                        }
                    }

                    if(i < board.length - 1){

                        if(board[i+1][j] != 2 && board[i+1][j] != 3 && board[i+1][j] != 4 && board[i+1][j] != 5 && board[i+1][j] != 0){

                            drawer.beginPath();
                            drawer.moveTo(i*P+P+SPACE*i+CIRCLE_SIZE, j*P+P+SPACE*j)
                            drawer.lineTo(i*P+P+SPACE*i+CIRCLE_SIZE+SPACE, j*P+P+SPACE*j);
                            drawer.stroke();
                        }
                    }
                }

            }

        }  
    }
}