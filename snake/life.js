//create clone--
//for each space on the grid
//check to see if the neighbors are of the class "S" or "H"
//determine its next property and apply it to new grid at its position
//once all nodes have added their value...
//repeat process until user restarts with a key press
//function game of life
Snake.prototype.gameOfLife = function () {
  var replacement = this.newGrid();
  for(var i = 0; i < 20; i++) {
    var row = this.grid[i];
    for (var c = 0; c < 20; c++) {
      var pos = [i, c];
      var cell = row[c];
      var totalNeighbors = this.checkNeighbors(pos);
      replacement[i][c] = this.live(cell, totalNeighbors);
    }
  }
};

Snake.prototype.totalNeighbors = function (pos) {
  var neighbors = 0;
  //holds neighbor position
  var npos = [0, 0];
  //topleft
  npos = [pos[0] - 1, pos[1] - 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //top
  npos = [pos[0] - 1, pos[1]];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //topright
  npos = [pos[0] - 1, pos[1] + 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //right
  npos = [pos[0], pos[1] + 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //bottomright
  npos = [pos[0] + 1, pos[1] + 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //bottom
  npos = [pos[0] + 1, pos[1]];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //bottomleft
  npos = [pos[0] + 1, pos[1] - 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  //left
  npos = [pos[0], pos[1] - 1];
  if(!this.outOfBounds(npos)) {
    if (this.board[npos[0]][npos[1]] == "S") neighbors++;
  }
  return neighbors;
};


Snake.prototype.live = function (cell, total) {
  //is the cell alive?
  if((cell !== "H" || cell !== "S")) {
    //lives if it has exactly 3 neighbors
    if ( total === 3 ) return "S";
    //stays dead otherwise
    return "e";
  }
  //dies from underpopulation OR overpopulation
  if (total < 2 || total > 3) {
    return "e";
  }
  //lives on
  return "S";
};
