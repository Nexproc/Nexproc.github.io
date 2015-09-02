(function () {
  var Snakes = window.Snakes = window.Snakes || {};

  var DIRECTIONS = {"N": [-1, 0], "E":[0, 1], "S": [1, 0], "W":[0, -1]};

  var Snake = Snakes.Snake = function () {
    this.dir = "E";
    this.segments = [new Coord([0,0]), new Coord([1,0]), new Coord([2,0]), new Coord([3,0])];
  };

  Snake.prototype.grow = function () {
    var tailPos = this.segments[this.segments.length - 1].pos;
    for (var i = 0; i < 4; i++) {
      this.segments.push(new Coord(tailPos));
    }
  };

  Snake.prototype.move = function () {
    var head = this.segments[0];
    var newEl = head.plus(DIRECTIONS[this.dir]);
    this.segments.unshift(newEl);
    this.segments.pop();
  };

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  var Coord = Snakes.Coord = function (pos) {
    this.pos = pos;
  };

  Coord.prototype.plus = function (otherPos) {
    return new Coord([
      this.pos[0] + otherPos[0],
      this.pos[1] + otherPos[1]
    ]);
  };

  Coord.prototype.equals = function (otherPos) {
    return this.pos[0] === otherPos[0] && this.pos[1] === otherPos[1];
  };

  Coord.prototype.isOpposite = function (otherPos) {
    return this[0] === -otherPos[0] && this[1] === -otherPos[1];
  };

  var Board = Snakes.Board = function () {
    this.snake = new Snakes.Snake();
    this.grid = this.newGrid();
    this.lost = false;
    this.addApple();
  };

  Board.prototype.eatApple = function (pos) {
    this.grid[pos[0]][pos[1]] = "e";
    this.snake.grow();
    this.addApple();
  };

  Board.prototype.addApple = function () {
    var applePos = null;
    var compCallBack = function(segment) { return segment.equals(applePos); };
    while (!applePos) {
      applePos = this.randApplePos();
      if(this.snake && this.snake.segments.some(compCallBack)) applePos = null;
    }
    this.dropApple(applePos);
  };

  Board.prototype.randApplePos = function () {
    return [
      Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 20)
    ];
  };

  Board.prototype.dropApple = function (applePos) {
    this.grid[applePos[0]][applePos[1]] = "A";
  };

  Board.prototype.newGrid = function () {
    var grid = [];
    for (var i = 0; i < 20; i++) {
      grid.push((function () {
        var newRow = [];
        for (var j = 0; j < 20; j++) {
          newRow.push("e");
        }

        return newRow;
      })());
    }

    return grid;
  };

  Board.prototype.render = function () {
    var headPos = this.snake.segments[0].pos;
    if(this.lost) {
      this.snake.head = "S";
      this.gameOfLife();
    } else {
      this.renderSnakeBody();
      this.checkLosingConditions(headPos);
    }
    if (!this.lost) {
      this.grid[headPos[0]][headPos[1]] === "A" && this.eatApple(headPos);
      this.grid[headPos[0]][headPos[1]] = "H";
    }
    var art = this.drawGrid();
    !this.lost && this.renderEmptySpaces();
    return art;
  };

  Board.prototype.drawGrid = function () {
    var art = "";
    this.grid.forEach(function (row) {
      row.forEach(function (cell) { art += cell; });
      art += "\n";
    });
    return art;
  };

  Board.prototype.renderSnakeBody = function () {
    var that = this;
    this.snake.segments.slice(1).forEach(function (segment) {
      that.grid[segment.pos[0]][segment.pos[1]] = "S";
    });
  };

  Board.prototype.renderEmptySpaces = function () {
    var that = this;
    this.snake.segments.forEach(function (segment) {
      if(that.outOfBounds(segment.pos)) return;
      that.grid[segment.pos[0]][segment.pos[1]] = "e";
    });
  };

  Board.prototype.checkLosingConditions = function (headPos) {
    if (this.outOfBounds(headPos)) {this.lost = true;}
    else if (this.grid[headPos[0]][headPos[1]] === "S") {this.lost = true;}
  };

  Board.prototype.outOfBounds = function (pos) {
    if (pos[0] >= 20 || pos[1] >= 20) return true;
    if (pos[0] < 0 || pos[1] < 0) return true;
    return false;
  };

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
    var neighbors = 0;
    //holds neighbor position
    var npos = [0, 0];
    //topleft
    npos = [pos[0] - 1, pos[1] - 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //top
    npos = [pos[0] - 1, pos[1]];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //topright
    npos = [pos[0] - 1, pos[1] + 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //right
    npos = [pos[0], pos[1] + 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //bottomright
    npos = [pos[0] + 1, pos[1] + 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //bottom
    npos = [pos[0] + 1, pos[1]];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //bottomleft
    npos = [pos[0] + 1, pos[1] - 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
    //left
    npos = [pos[0], pos[1] - 1];
    !this.outOfBounds(npos) && this.checkN(npos) && neighbors++;
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
