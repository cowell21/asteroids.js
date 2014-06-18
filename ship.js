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
    rot = Ship.ROTATION;
    MovingObject.call(this, pos, vel, color, rad, rot);
  }

  Ship.inherits(MovingObject);
  Ship.RADIUS = 10;
  Ship.COLOR = "#7CFC00";
  Ship.ROTATION = Math.PI; //standard rotation

  Ship.prototype.power = function () {
    this.vel[0] += Math.sin(rot);
    this.vel[1] -= Math.cos(rot);
  }

  Ship.prototype.rotate = function (direction) {
    rot += direction;
  }

})(this);
