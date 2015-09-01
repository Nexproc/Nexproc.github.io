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
    setInterval(this.step.bind(view), 500);
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
          if (dir !== "E") { dir = "W"; }
          break;
        case 38:
          if (dir !== "S") { dir = "N"; }
          break;
        case 39:
          if (dir !== "W") { dir = "E"; }
          break;
        case 40:
          if (dir !== "N") { dir = "S"; }
          break;
    }
    this.board.snake.turn(dir);
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
  };
})();
