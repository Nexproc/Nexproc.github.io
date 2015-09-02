;(function () {
  var Snakes = window.Snakes = window.Snakes || {};

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
})();
