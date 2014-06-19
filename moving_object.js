(function (root) {

  var App = root.App = (root.App || {});

  var MovingObject = App.MovingObject = function (pos, vel, color, rad, rot) {
    this.color = color;
    this.rad = rad;
    this.vel = vel;
    this.pos = pos;
    this.rot = rot;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.pos[0] > App.Game.DIM_X + (this.rad*2)) {
      this.pos[0] -= (App.Game.DIM_X + (this.rad*4));
    }
    if (this.pos[0] < 0 - (this.rad*2)) {
      this.pos[0] += (App.Game.DIM_X + (this.rad*4));
    }
    if (this.pos[1] > App.Game.DIM_Y + (this.rad*2)) {
      this.pos[1] -= (App.Game.DIM_Y + (this.rad*4));
    }
    if (this.pos[1] < 0 - (this.rad*2)) {
      this.pos[1] += (App.Game.DIM_Y + (this.rad*4));
    }
  }

  MovingObject.prototype.moveBullet = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.pos[0] > App.Game.DIM_X + (this.rad*2) || this.pos[0] < 0 - (this.rad*2)) {
      this.pos = [-100, -100];
      this.vel = [0, 0];
    }
    if (this.pos[1] > App.Game.DIM_Y + (this.rad*2) || this.pos[1] < 0 - (this.rad*2)) {
      this.pos = [-100, -100];
      this.vel = [0, 0];
    }
  }

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.rad,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  }

  MovingObject.prototype.drawAsteroid = function (ctx) {
    var img = document.getElementById("home");
    var x = this.pos[0] - this.rad;
    var y = this.pos[1] - this.rad;

    ctx.drawImage(img,Math.floor(this.rot % 360), Math.floor(this.rot / 360),72,72,x,y,40,40);
  }

  MovingObject.prototype.drawShip = function (ctx) {
    // ctx.fillStyle = this.color;
    // ctx.beginPath();
    //
    // ctx.arc(
    //   this.pos[0],
    //   this.pos[1],
    //   this.rad,
    //   (0.75) * Math.PI + rot,
    //   (2.25) * Math.PI + rot,
    //   false
    // );
    //
    // ctx.fill();

    var img = document.getElementById("ship");
    var boost = document.getElementById("boost");

    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(rot);
    ctx.drawImage(img, -40, -40, 80, 80);
    if (App.Game.SORRY === true) {
      ctx.drawImage(boost, -40, -45, 80, 80);
      App.Game.SORRY = false;
    }

    ctx.restore();
  }

  MovingObject.prototype.isCollidedWith = function (OtherObject) {
    var x_length = this.pos[0] - OtherObject.pos[0];
    var y_length = this.pos[1] - OtherObject.pos[1];
    var distance = Math.sqrt(Math.pow(x_length,2) + Math.pow(y_length,2))

    var total_radius = this.rad + OtherObject.rad;

    return distance < total_radius;
  }
})(this)