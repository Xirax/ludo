
class ServerFunc {

    static roomData(ID){

        return { roomID: ID, players: [], ready: [], moving: 0, pawns: [], started: false, player_time: -1, reset: false, winner: null};
      }
      
          
    static newPlayerPawns(){
      
          let pawns = [];
          for(let j=0; j<4; j++) pawns.push({distance: 0, move: 0});
      
          return pawns;
      }
      
    static time(old){ 

        let time_left = Date.now() - old; 
        return 70 - Math.round(time_left / 1000);
    }
}


module.exports = ServerFunc;