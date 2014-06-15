(function (root) {
  var App = root.App = (root.App || {});

  var inTheHole = 0;
  var gameover = false;
  var startSeq = true;
  var score = 0;

  var Game = App.Game = function (ctx, canSize) {
      this.ctx = ctx;
      this.stars = this.addStars(30);
      this.asteroids = this.addAsteroids(10);
      this.ship = new App.Ship([(Game.DIM_X / 2), (Game.DIM_Y / 2)], [0,0]);
      this.bullets = this.addBullets(50);
      this.bindKeyHandler();
  };

  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
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

    this.ctx.font = "20px bitfont";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Points: " + score, 10 ,50);

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].draw(this.ctx);
    }

    if (gameover === false) {
      for (var i = 0; i < this.asteroids.length; i++) {
        this.asteroids[i].draw(this.ctx);
      }

      for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(this.ctx);
      }

      this.ship.drawShip(this.ctx);
    } else {
      this.ctx.font = "32px bitfont";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Game Over", 350 ,300);
    }

  };

  Game.prototype.startDraw = function () {
    this.ctx.fillStyle="black";
    this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.ctx.font = "20px bitfont";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Instructions:", 350 ,200);
    this.ctx.font = "14px bitfont";
    this.ctx.fillText("Boost: UP", 350 ,250);
    this.ctx.fillText("Rotate Counter-Clockwise: LEFT", 350 ,280);
    this.ctx.fillText("Rotate Clockwise: RIGHT", 350 ,310);
    this.ctx.fillText("Fire: Spacebar", 350 ,340);

    this.ctx.font = "32px bitfont";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("Press Enter To Begin", 200, 450);

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].draw(this.ctx);
    }

  };

  Game.prototype.move = function () {

    for (var i = 0; i < this.stars.length; i++) {
      this.stars[i].move();
    }

    if (startSeq === false) {
      this.ship.move();

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
    }

  };

  Game.prototype.step = function () {
    this.move();

    if (startSeq) {
      this.startDraw();
    } else {
      this.draw();
    }

    if (gameover != true) {
      this.checkCollision();
    }
  };

  Game.prototype.checkCollision = function () {

    for (var i = 0; i < this.asteroids.length; i++){
      if (this.asteroids[i].isCollidedWith(this.ship)) {
        $('.bgmusic')[0].volume = 0.25;
        $('.gameovernoise').html("<source src='media/gameover.mp3' type='audio/mpeg' >" );
        gameover = true;
      }

      for (var j = 0; j < 30; j++) {
        if ( this.asteroids[i].isCollidedWith(this.bullets[j]) ) {
          score += 10;
          this.asteroids[i].pos = [-100, 100];

          $('.boomnoise').html("<source src='media/boom.mp3' type='audio/mpeg' >" );
        }
      }

    }
  };

  Game.prototype.start = function () {
    game = this;


    window.setInterval(function () {
      game.step();

      // if ($('.bgmusic')[0].volume != 1) {
      //   var temp = $('.bgmusic')[0].volume * 1000;
      //   $('.bgmusic')[0].volume = (5 + temp) / 1000;
      // };

    }, 30);
  };

  Game.prototype.bindKeyHandler = function () {
    var ship = this.ship;
    var bullets = this.bullets;

    startSeq = true;

    key('enter', function(){ startSeq = false; });
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
