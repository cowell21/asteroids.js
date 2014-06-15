Function.prototype.inherits = function (superClass) {
  function Surrogate () {}
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
};

(function (root) {
  var App = root.App = (root.App || {});
  var MovingObject = App.MovingObject;
  var Star = App.Star = function (pos, vel){
    var color = Star.COLOR;
    var rad = Math.floor(Math.random() * 2 + 1);
    MovingObject.call(this, pos, vel, color, rad);
  };

  Star.inherits(MovingObject);
  Star.COLOR = "white";

  Star.randomStar = function (dimX, dimY) {
    var x = Math.floor(Math.random() * dimX);
    var y = Math.floor(Math.random() * dimY);
    return new Star([x,y], [(Math.random() * 2 + 1),0]);
  };

}
)(this);