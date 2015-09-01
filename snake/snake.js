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
    return this[0] === otherPos[0] && this[1] === otherPos[1];
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
    console.log(pos);
    this.grid[pos[0]][pos[1]] = "e";
    this.snake.grow();
    this.addApple();
  };

  Board.prototype.addApple = function () {
    var applePos = null;
    var compCallBack = function(segment) { return segment.equals(applePos); };
    while (!applePos) {
      applePos = this.randApplePos();
      if(this.snake && this.snake.segments.some(compCallBack)) {
        debugger
        applePos = null;
      }
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
    var snake = this;
    var headPos = this.snake.segments[0].pos;
    if (this.grid[headPos[0]][headPos[1]] === "A") this.eatApple(headPos);
    this.renderSnakeBody();
    this.checkLosingConditions(headPos);
    this.grid[headPos[0]][headPos[1]] = "H";

    var art = this.drawGrid();

    this.renderEmptySpaces();

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
      that.grid[segment.pos[0]][segment.pos[1]] = "e";
    });
  };

  Board.prototype.checkLosingConditions = function (headPos) {
    if (this.grid[headPos[0]][headPos[1]] === "S") {this.lost = true;}
    else if (this.outOfBounds(headPos)) {this.lost = true;}
  };

  Board.prototype.outOfBounds = function (pos) {
    if (pos[0] >= 20 || pos[1] >= 20) return true;
    if (pos[0] < 0 || pos[1] < 0) return true;
    return false;
  };
})();
