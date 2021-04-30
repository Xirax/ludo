const e = require('express');
var express = require('express');
var path = require('path');
var router = express.Router();

var html_path = '../public/html';

var rooms = [];
var room_index = 0;

var room_color = 0;


var ServerFunc = require('./server_functions');


router.get('/', function(req, res) {

  if(!req.session.nick) res.sendFile(path.join(__dirname, html_path, 'login.html'));
  else res.sendFile(path.join(__dirname, html_path, 'index.html'));

});


router.post('/start', function(req, res){

    if(rooms.length == 0) rooms.push(ServerFunc.roomData(0));
    
    

    if(room_color > 3 || rooms[room_index].started){
      rooms.push(ServerFunc.roomData(++room_index));
      room_color = 0;
    } 

    let data = req.body;

    req.session.nick = data.nick;
    req.session.room = room_index;
    req.session.color = room_color++;
    req.session.dice = true;

    rooms[room_index].players.push(data.nick);
    rooms[room_index].ready.push(false);
    rooms[room_index].pawns.push(ServerFunc.newPlayerPawns());
    rooms[room_index].pl_count += 1;

    let res_data = {
      nick : req.session.nick,
      color: req.session.color
    }
    
    res.send({user_data: res_data});
}); 


router.get('/gameState', function(req, res){

    if(rooms.length > 0){

      let rindex = req.session.room;

      let pl = rooms[rindex].players;
      let st = rooms[rindex].started;
      let active = rooms[rindex].moving;
      let mv = (rooms[rindex].moving == req.session.color) ? true : false;

      if(rooms[rindex].player_time == -1) rooms[rindex].player_time = Date.now();

      let time = ServerFunc.time(rooms[rindex].player_time);

      if(time <= 0 && rooms[rindex].started){
        
        rooms[rindex].players[rooms[rindex].moving] = '';
        rooms[rindex].pl_count -= 1;
        rooms[rindex].moving++;

        while(rooms[rindex].moving < rooms[rindex].players.length && rooms[rindex].players[rooms[rindex].moving] == '') rooms[rindex].moving++;
        if(rooms[rindex].moving >= rooms[rindex].players.length) rooms[rindex].moving = 0;

        rooms[rindex].player_time = Date.now();

        if(rooms[rindex].pl_count < 2) rooms[rindex].reset = true;
      }



      if(st) res.send({started: st, moving: mv, players: pl, active_player: active, time: time});
      else res.send({started: st, players: pl, reset: rooms[rindex].reset});
    }
});

router.get('/secret', function(req, res){

  res.sendFile(path.join(__dirname, html_path, 'err.html'));

});
  


router.get('/resetMe', function(req, res){

  if(req.session.nick){
    let rindex = req.session.room;

    rooms[rindex].players[req.session.color] = '';
    rooms[rindex].pl_count -= 1;
  
    rooms[rindex].started = false;
  
    req.session.nick = null;
    req.session.room = null;
    req.session.color = null;
    req.session.dice = null;

    if(rooms[rindex].players.length == 0) rooms[rindex] = ServerFunc.roomData(rindex);
  
    res.sendFile(path.join(__dirname, html_path, 'err.html'));
  }
  else res.redirect('/');

});



router.post('/ready', function(req, res){

    let data = req.body;

    let rindex = req.session.room;

    rooms[rindex].ready[req.session.color] = data.toggle;

    let room_ready = true;


    if(rooms[rindex].ready.length != 4){

      for(let i=0; i<rooms[rindex].ready.length; i++){

        if(!rooms[rindex].ready[i]) { room_ready = false; break;  }
      }
    }

    if(rooms[rindex].ready.length == 1) room_ready = false;

    if(room_ready){
      rooms[rindex].player_time = Date.now();
      rooms[rindex].started = true;
    } 

    res.send({ready: room_ready});
});



router.get('/makeMove', function(req, res){


  if(req.session.color == rooms[req.session.room].moving){

    let dice_result = Math.round(Math.random() * 5) + 1;

    let pawns = rooms[req.session.room].pawns[req.session.color];

    for(let i=0; i<4; i++){

      if(pawns[i].distance == 0){

        if(dice_result == 1 || dice_result == 6 || dice_result == 7) pawns[i].move = 1;
        else pawns[i].move = 0;
      }
      else{
        pawns[i].move = dice_result;

        let endgame = pawns[i].move + pawns[i].distance;

        if(endgame >= 40){
          
          let move_possible = true;

          for(let j=0; j<4; j++){
            if(j != i && pawns[j].distance == endgame) { move_possible = false; break; }
          }

          if(endgame > 43) move_possible = false;


          if(!move_possible) pawns[i].move = 0; 
      }
    } 
  } 
    
  req.session.dice = false;

  rooms[req.session.room].pawns[req.session.color] = pawns;

  res.send({pawns: pawns, color: req.session.color, dice: dice_result});

  } 
  else res.send({ pawns: null });

});

router.get('/dice', function(req, res){

  res.send({throw: req.session.dice});
});


router.post('/selectedPawn', function(req, res){

  if(req.session.color == rooms[req.session.room].moving){

    let data = req.body;

    let rindex = req.session.room;
    let cindex = req.session.color;

    rooms[rindex].pawns[cindex][data.pawn].distance += rooms[rindex].pawns[cindex][data.pawn].move;

    rooms[rindex].moving++;

    rooms[rindex].player_time = Date.now();

    while(rooms[rindex].moving < rooms[rindex].players.length && rooms[rindex].players[rooms[rindex].moving] == '') rooms[rindex].moving++;
    if(rooms[rindex].moving >= rooms[rindex].players.length) rooms[rindex].moving = 0;

    req.session.dice = true;


    for(let i=0; i<rooms[rindex].pl_count; i++){

      if(i == cindex) i++;

      if(i >= rooms[rindex].pl_count) break;

      let hunter_distance = rooms[rindex].pawns[cindex][data.pawn].distance + (cindex * 10);

      for(let j=0; j<4; j++){

        let oponent_distance = rooms[rindex].pawns[i][j].distance  + (i * 10);

        let fixed_dsc = (40 - (i* 10));

        
        if(oponent_distance != 0 && oponent_distance <= 41 && 
          (oponent_distance == hunter_distance || 
           (oponent_distance + fixed_dsc) == hunter_distance || 
           oponent_distance == (hunter_distance + 40))) rooms[rindex].pawns[i][j].distance = 0;
      }
    }

    let win = 0;

    for(let i=0; i<4; i++){ if(rooms[rindex].pawns[cindex][i].distance >= 41) win++; }

    if(win == 4) rooms[rindex].winner = cindex;   
  }

  res.send({board_state: rooms[req.session.room].pawns });
});

router.get('/boardState', function(req, res){

  if(rooms[req.session.room]) res.send({ board_state: rooms[req.session.room].pawns });
})



router.get('/winner', function(req, res){
  
  if(rooms[req.session.room].winner != null) res.sendFile(path.join(__dirname, html_path, 'winner.html'));
})

router.get('/winnerInfo', function(req, res){

  let rindex = req.session.room;

  rooms[rindex].players[req.session.color] = '';
  rooms[rindex].pl_count -= 1;
  
  rooms[rindex].started = false;
  
  req.session.nick = null;
  req.session.room = null;
  req.session.color = null;
  req.session.dice = null;

  res.send({winner: rooms[rindex].winner})
})


module.exports = router;
