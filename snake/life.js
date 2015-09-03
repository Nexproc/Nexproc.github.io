//create clone--
//for each space on the grid
//check to see if the neighbors are of the class "S" or "H"
//determine its next property and apply it to new grid at its position
//once all nodes have added their value...
//repeat process until user restarts with a key press
//function game of life
;(function () {

  var Board = Snakes.Board;

  Board.prototype.gameOfLife = function () {
    var replacement = this.newGrid();
    for(var i = 0; i < 20; i++) {
      for (var c = 0; c < 20; c++) {
        var pos = [i, c];
        var cell = this.grid[i][c];
        var total = this.totalNeighbors(pos);
        replacement[i][c] = this.live(cell, total);
      }
    }
    this.grid = replacement;
  };

  Board.prototype.totalNeighbors = function (pos) {
    //TL, T, TR, R
    //BR, B, BL, L
    var vectors = [
                    [-1, -1], [-1, 0], [-1, 1], [0, 1],
                    [1, 1], [1, 0], [1, -1], [0, -1]
                  ];
    //number of neighbors
    var neighbors = 0;
    //holds neighbor position
    var that = this;
    vectors.forEach(function (vector) {
      var npos = [pos[0] + vector[0], pos[1] + vector[1]];
      !that.outOfBounds(npos) && that.checkN(npos) && ++neighbors;
    });
    
    return neighbors;
  };

  Board.prototype.checkN = function (npos) {
    return this.grid[npos[0]][npos[1]] == "S";
  };


  Board.prototype.live = function (cell, total) {
    //is the cell alive?
    if(cell !== "S") {
      //lives if it has exactly 3 neighbors
      if ( total === 3 ) return "S";
      //stays dead otherwise
      return "e";
    }
    //dies from underpopulation OR overpopulation
    if (total < 2 || total > 3) return "e";
    //lives on
    return "S";
  };
})();
