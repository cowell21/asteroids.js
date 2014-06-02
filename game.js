(function (root) {
  var App = root.App = (root.App || {});
  var Asteroid = App.Asteroid
  var Ship = App.Ship
  var Game = App.Game = function (ctx) {

      this.ctx = ctx;
      this.asteroids = this.addAsteroids(3);
      this.ship = new App.Ship([(Game.DIM_X / 2), (Game.DIM_Y / 2)], [0,0]);
      this.bindKeyHandler();
  }

  Game.DIM_X = 500;
  Game.DIM_Y = 500;
  Game.FPS = 30;

  Game.prototype.addAsteroids = function (numAsteroids) {
    var asteroids = [];

    for (var i = 0; i < numAsteroids; i++) {
      asteroids.push(Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
    }

    return asteroids;
  }

  Game.prototype.draw = function () {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ship.draw(this.ctx);

    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].draw(this.ctx);
    }
  }

  Game.prototype.move = function () {
    this.ship.move();
    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].move();
    }
  }

  Game.prototype.step = function () {
    this.move();
    this.draw();
    this.checkCollision();
  }

  Game.prototype.checkCollision = function () {
    for (var i = 0; i < this.asteroids.length; i++){
      if (this.asteroids[i].isCollidedWith(this.ship)) {
        alert('You Died');
        this.asteroids = []
      }

    }

  }

  Game.prototype.start = function () {
    game = this;

    window.setInterval(function () {
          game.step();
        }, 30);
  }

  Game.prototype.bindKeyHandler = function () {
    var ship = this.ship
    key('a', function(){ship.power([-1,0])});
    key('d', function(){ship.power([1,0])});
    key('w', function(){ship.power([0,-1])});
    key('s', function(){ship.power([0,1])});
  }


})(this)