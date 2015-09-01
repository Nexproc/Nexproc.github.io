(function () {
  if (typeof Snakes === "undefined") {
    window.Snakes = {};
  }

  var View = Snakes.View = function ($el) {
    this.board = new Snakes.Board();
    this.$el = $el;
    this.scaffold();
    this.render();
    this.buildListener.call(this);
    var view = this;
    this.nextDir = null;
    setInterval(this.step.bind(view), 100);
  };

  View.prototype.scaffold = function () {
    for (var i = 0; i < 20; i++) {
      var row = $("<li id='row" + i + "'>");
      for (var c = 0; c < 20; c++) {
        row.append($("<div id='col" + c + "'>"));
      }
      $("ul").append(row);
    }
  };

  View.prototype.render = function () {
    var art = (this.board.render());
    var arr = art.split("\n");
    for (var i = 0; i < 20; i++) {
      var row = arr[i].split("");
      for (var c = 0; c < 20; c++) {
        $("#row" + i + " #col" + c).removeClass().addClass(row[c]);
      }
    }
  };

  View.prototype.buildListener = function () {
    console.log(this);
    $('body').on("keydown", this.handleKeyEvent.bind(this));
  };

  View.prototype.handleKeyEvent = function (event) {
    var dir = this.board.snake.dir;
    console.log();
    switch (event.keyCode) {
        case 37:
        case 65:
          if (dir !== "E") { this.nextDir = "W"; }
          break;
        case 38:
        case 87:
          if (dir !== "S") { this.nextDir = "N"; }
          break;
        case 39:
        case 68:
          if (dir !== "W") { this.nextDir = "E"; }
          break;
        case 40:
        case 83:
          if (dir !== "N") { this.nextDir = "S"; }
          break;
    }
  };

  View.prototype.step = function () {
    if (this.nextDir) this.board.snake.turn(this.nextDir);
    this.nextDir = null;
    this.board.snake.move();
    this.render();
  };
})();
