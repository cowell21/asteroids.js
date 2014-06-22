(function (root) {
  var App = root.App = (root.App || {});

  var inTheHole = 0;
  var gameover = false;
  var startSeq = true;
  var score = 0;

  var Game = App.Game = function (ctx, canSize) {
      this.ctx = ctx;
      this.stars = this.addStars(30);
      this.ship = new App.Ship([(Game.DIM_X / 2), (Game.DIM_Y / 2)], [0,0]);
      this.bullets = this.addBullets(50);
      this.bindKeyHandler();
  };

  Game.SORRY = false;
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
        this.asteroids[i].drawAsteroid(this.ctx);
      }

      for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(this.ctx);
      }

      this.ship.drawShip(this.ctx);
    } else {
      this.ctx.font = "32px bitfont";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Game Over", 350 ,300);

      this.ctx.font = "32px bitfont";
      this.ctx.fillStyle = "red";
      this.ctx.fillText("Press Enter Play Again", 180, 450);
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
    this.bindKeyHandler()
    this.move();

    if (startSeq) {
      this.startDraw();
    } else {
      this.draw();
    }

    if (gameover != true && startSeq != true) {
      this.checkCollision();
    }
  };



  Game.prototype.checkCollision = function () {

    for (var i = 0; i < this.asteroids.length; i++){

      if (this.asteroids[i].rot >= 1300) continue;

      for (var j = 0; j < 30; j++) {
        if ( this.asteroids[i].isCollidedWith(this.bullets[j]) ) {
          score += 10;
          this.bullets[j].pos = [-100,-100]
          this.asteroids[i].rot = 1300;
          this.asteroids.push(App.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
          $('.boomnoise')[0].currentTime = 0;
          $('.boomnoise')[0].play();
        }
      }

      if (this.asteroids[i].isCollidedWith(this.ship)) {
        $('.bgmusic')[0].volume = 0.25;
        $('.boomnoise')[0].currentTime = 0;
        $('.boomnoise')[0].play();
        $('.gameovernoise')[0].currentTime = 0;
        $('.gameovernoise')[0].play();

        gameover = true;
        this.asteroids = [];
      }

    }
  };

  Game.prototype.start = function () {
    game = this;

    window.setInterval(function () {
      game.step();
    }, 30);
  };

  Game.prototype.bindKeyHandler = function () {
    if (key.isPressed('enter')) { this.pressedEnter(); };
    if (key.isPressed('left')) { this.ship.rotate(Math.PI * -0.1) };
    if (key.isPressed('right')) { this.ship.rotate(Math.PI * 0.1) };
    if (key.isPressed('up')) { this.pressedUp(); };
    if (key.isPressed('space')) { this.pressedSpace(); };
  };

  Game.prototype.pressedEnter = function () {
    for (var i = 0; i < 50; i++) {
      this.bullets[i].pos = [-100, -100];
    }

    startSeq = false;
    gameover = false;
    score = 0;

    this.asteroids = this.addAsteroids(5);
    this.ship.pos = [(Game.DIM_X / 2), (Game.DIM_Y / 2)];
    this.ship.vel = [0,0];
    $('.bgmusic')[0].volume = 1;
  };

  Game.prototype.pressedSpace = function () {
    $('.shootnoise')[0].currentTime = 0;
    $('.shootnoise')[0].play();

    this.bullets[inTheHole].pos = [this.ship.pos[0], this.ship.pos[1]];
    this.bullets[inTheHole].vel = [4 * Math.sin(rot) + this.ship.vel[0],
     -4 * Math.cos(rot) + this.ship.vel[1]];

    inTheHole += 1;
    if ( inTheHole === 30 ) { inTheHole = 0; }
  };

  Game.prototype.pressedUp = function () {
    this.ship.power();
    Game.SORRY = true; //needs to be changed
    $('.boostnoise')[0].currentTime = 0;
    $('.boostnoise')[0].play();
  };

})(this)