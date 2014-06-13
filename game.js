(function (root) {
  var App = root.App = (root.App || {});
  var Asteroid = App.Asteroid
  var Ship = App.Ship
  var Bullet = App.Bullet
  var inTheHole = 0;
  var Game = App.Game = function (ctx) {
      this.ctx = ctx;
      this.asteroids = this.addAsteroids(3);
      this.ship = new App.Ship([(Game.DIM_X / 2), (Game.DIM_Y / 2)], [0,0]);
      this.bullets = this.addBullets(50);
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

  Game.prototype.addBullets = function (numBullets) {
    var bullets = [];
    for (var i = 0; i < numBullets; i++) {
      bullets.push(App.Bullet.gen([-100, -100],[0, 0]));
    }
    return bullets;
  }

  Game.prototype.draw = function () {
    this.ctx.fillStyle="#FFFFFF";
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    //was clearRect

    this.ship.drawShip(this.ctx);

    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].draw(this.ctx);
    }

    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(this.ctx);
    }
  }

  Game.prototype.move = function () {
    this.ship.move();
    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].move();
    }

    for (var i = 0; i < 50; i++) {
      if (this.bullets[i].pos[0] != -100 ) {
        this.bullets[i].moveBullet();
      }
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
        //alert('You Died');
        //this.asteroids = [];
      }

      for (var j = 0; j < 30; j++) {
        if ( this.asteroids[i].isCollidedWith(this.bullets[j]) ) {
          //debugger;
          this.asteroids[i].rad = 0
        }
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
    var ship = this.ship;
    var bullets = this.bullets;
    key('a', function(){ ship.rotate(Math.PI * -0.1) });
    key('d', function(){ ship.rotate(Math.PI * 0.1) });
    key('w', function(){ ship.power() });
    //key('s', function(){  });
    key('e', function(){

      bullets[inTheHole].pos = [ship.pos[0], ship.pos[1]];
      bullets[inTheHole].vel = [4 * Math.sin(rot) + ship.vel[0],
       -4 * Math.cos(rot) + ship.vel[1]];

      // preps the next bullet in the ship's cannon
      if ( inTheHole === 29 ) {
        inTheHole = 0;
      } else {
        inTheHole += 1;
      }

    });
  }


})(this)
