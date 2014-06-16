Function.prototype.inherits = function (superClass) {
  function Surrogate () {}
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
};

(function (root) {

  var App = root.App = (root.App || {});
  var MovingObject = App.MovingObject;

  var Asteroid = App.Asteroid = function (pos, vel){
    var color = Asteroid.COLOR;
    var rad = Asteroid.RADIUS;
    var rot = 72 * Math.floor(Math.random() * 18);
    MovingObject.call(this, pos, vel, color, rad, rot);
  };

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "lightgrey";
  Asteroid.RADIUS = 20;
  Asteroid.SPEED = 10;

  Asteroid.randomVec = function () {
    var x = Math.floor(Math.random() * Asteroid.SPEED) - (Asteroid.SPEED/2);
    var y = Math.floor(Math.random() * Asteroid.SPEED) - (Asteroid.SPEED/2);
    if (x === 0) { x += 1 };
    if (y === 0) { y += 1 };
    return [x, y];
  }

  Asteroid.randomPos = function (dimX, dimY) {
    var x = 0;
    var y = 0;

    if (Math.random() < 0.5) {
      x = Math.floor(Math.random() * dimX);
      Math.random() < 0.5 ? y = 0 : y = dimY ;
    } else {
      y = Math.floor(Math.random() * dimY);
      Math.random() < 0.5 ? x = 0 : x = dimX ;
    }

    return [x, y];
  }

  Asteroid.randomAsteroid = function (dimX, dimY) {
    return new Asteroid(this.randomPos(dimX, dimY), this.randomVec() );
  }

}
)(this);