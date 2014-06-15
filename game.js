(function (root) {
  var App = root.App = (root.App || {});

  var inTheHole = 0;
  var gameover = false;

  var Game = App.Game = function (ctx, canSize) {
      this.ctx = ctx;
      this.stars = this.addStars(30);
      this.asteroids = this.addAsteroids(3);
      this.ship = new App.Ship([(Game.DIM_X / 2), (Game.DIM_Y / 2)], [0,0]);
      this.bullets = this.addBullets(50);
      this.bindKeyHandler();
  };

  Game.DIM_X = 700;
  Game.DIM_Y = 700;
  Game.FPS = 30;

  Game.prototype.addAsteroids = function (numAsteroids) {
    var asteroids = [];
    for (var i = 0; i < numAsteroids; i++) {
      asteroids.push(App.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
    }
    return asteroids;
  };

  Game.prototype.addStars = function (numStars) {
    var stars = [];
    for (var i = 0; i < numStars; i++) {
      stars.push(App.Star.randomStar(Game.DIM_X, Game.DIM_Y));
    }
    return stars;
  };

  Game.prototype.addBullets = function (numBullets) {
    var bullets = [];
    for (var i = 0; i < numBullets; i++) {
      bullets.push(App.Bullet.gen([-100, -100],[0, 0]));
    }
    return bullets;
  };

  Game.prototype.draw = function () {
    this.ctx.fillStyle="black";

    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    //was clearRect

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].draw(this.ctx);
    }

    for (var i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].draw(this.ctx);
    }

    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(this.ctx);
    }

    this.ship.drawShip(this.ctx);
  };

  Game.prototype.move = function () {
    this.ship.move();

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].move();
    }

    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i].pos[0] != -100 ) {
        this.asteroids[i].move();
      }
    }

    for (var i = 0; i < 50; i++) {
      if (this.bullets[i].pos[0] != -100 ) {
        this.bullets[i].moveBullet();
      }
    }

  };

  Game.prototype.step = function () {
    this.move();
    this.draw();
    this.checkCollision();
  };

  Game.prototype.checkCollision = function () {

    for (var i = 0; i < this.asteroids.length; i++){
      if (this.asteroids[i].isCollidedWith(this.ship)) {
        $('.bgmusic')[0].volume = 0.20;
        $('.gameovernoise').html("<source src='media/gameover.mp3' type='audio/mpeg' >" );
        gameover = true;
      }

      for (var j = 0; j < 30; j++) {
        if ( this.asteroids[i].isCollidedWith(this.bullets[j]) ) {
          //this.asteroids[i].rad = 1;
          this.asteroids[i].pos = [-100, 100];
          $('.boomnoise').html("<source src='media/boom.mp3' type='audio/mpeg' >" );
        }
      }

    }
  };

  Game.prototype.start = function () {
    game = this;


    window.setInterval(function () {
      if (gameover != true) {
        game.step();
      } else {
        if ($('.bgmusic')[0].volume != 1) {
          var temp = $('.bgmusic')[0].volume * 1000;
          $('.bgmusic')[0].volume = (50 + temp) / 1000;
        };
      }
    }, 30);
  };

  Game.prototype.bindKeyHandler = function () {
    var ship = this.ship;
    var bullets = this.bullets;
    key('left', function(){ ship.rotate(Math.PI * -0.1) });
    key('right', function(){ ship.rotate(Math.PI * 0.1) });
    key('up', function(){
      ship.power();
      $('.boostnoise').html("<source src='media/boost.mp3' type='audio/mpeg' >" );
     });
    key('space', function(){
      $('.shootnoise').html("<source src='media/shot.mp3' type='audio/mpeg' >" );
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
