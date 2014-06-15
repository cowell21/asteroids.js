Function.prototype.inherits = function (superClass) {
  function Surrogate () {};
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
};

(function (root) {

  var App = root.App = (root.App || {});
  var MovingObject = App.MovingObject;

  var Asteroid = App.Asteroid = function (pos, vel){
    color = Asteroid.COLOR;
    rad = Asteroid.RADIUS;
    MovingObject.call(this, pos, vel, color, rad);
  }

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "lightgrey";
  Asteroid.RADIUS = 20;
  Asteroid.SPEED = 10
  Asteroid.randomVec = function () {
    var x = Math.floor(Math.random() * Asteroid.SPEED) - (Asteroid.SPEED/2);
    var y = Math.floor(Math.random() * Asteroid.SPEED) - (Asteroid.SPEED/2);
    if (x === 0) { x += 1 };
    if (y === 0) { y += 1 };
    return [x, y];
  }

  Asteroid.randomAsteroid = function (dimX, dimY) {
    var x = Math.floor(Math.random() * dimX);
    var y = Math.floor(Math.random() * dimY);

    if (x <= (dimX * 0.4) || x >= (dimX * 0.6) && y <= (dimY * 0.4) || y >= (dimY * 0.6) ){
      return new Asteroid([x,y], this.randomVec() );
    } else {
      return this.randomAsteroid(dimX, dimY);
    }

  }

}
)(this);

// var Game = MovingObjects.Game = function (posX, posY, numCircles) {
//     this. = posX;
//     this.yDim = yDim;
//
//     this.circles = []
//     for (var i = 0; i < numCircles; ++i) {
//       this.circles.push(Circle.randomCircle(xDim, yDim));
//     }
//   }
