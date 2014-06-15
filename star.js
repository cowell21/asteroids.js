Function.prototype.inherits = function (superClass) {
  function Surrogate () {}
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
};

(function (root) {
  var App = root.App = (root.App || {});
  var MovingObject = App.MovingObject;

  var Star = App.star = function (pos, vel){
    var color = Star.COLOR;
    var rad = Star.RADIUS;
    MovingObject.call(this, pos, vel, color, rad);
  };

  Star.inherits(MovingObject);
  Star.COLOR = "white";
  Star.RADIUS = Math.random() * 3 + 1;

  Star.randomVec = function () {
    var x = this.rad;
    var y = 0;
    if (x === 0) { x += 1; }
    return [x, y];
    //return [this.rad, 0];
  };

  Star.randomStar = function (dimX, dimY) {
    var x = Math.floor(Math.random() * dimX);
    var y = Math.floor(Math.random() * dimY);
    return new Star([x,y], this.randomVec());
  };

}
)(this);