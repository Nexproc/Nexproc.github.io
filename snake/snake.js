;(function () {
  var Snakes = window.Snakes = window.Snakes || {};

  var Coord = Snakes.Coord;

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
})();
