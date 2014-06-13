Function.prototype.inherits = function (superClass) {
  function Surrogate () {};
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
};

(function (root) {

  var App = root.App = (root.App || {});
  var MovingObject = App.MovingObject;

  var Ship = App.Ship = function (pos, vel){
    color = Ship.COLOR;
    rad = Ship.RADIUS;

    MovingObject.call(this, pos, vel, color, rad);
  }

  Ship.inherits(MovingObject);
  Ship.RADIUS = 10;
  Ship.COLOR = "red";

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

})(this);
