var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = pi * 2;
var max = Math.max;
var range = d3.range;
var path = d3.path;
var slice = Array.prototype.slice;

var constant = function(x) {
  return function() {
    return x;
  }
}


function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}


function customeRibbon() {
  var source = defaultSource,
    target = defaultTarget,
    radius = defaultRadius,
    startAngle = defaultStartAngle,
    endAngle = defaultEndAngle,
    context = null;

  function ribbon() {
    var buffer,
      argv = slice.call(arguments),
      s = source.apply(this, argv),
      t = target.apply(this, argv),
      sr = +radius.apply(this, (argv[0] = s, argv)),
      sa0 = startAngle.apply(this, argv) - halfPi,
      sa1 = endAngle.apply(this, argv) - halfPi,
      sx0 = sr * cos(sa0),
      sy0 = sr * sin(sa0),
      sx1 = sr * cos(sa1),
      sy1 = sr * sin(sa1),
      tx0 = t.x,
      ty0 = t.y,
      my0 = (sy0 + ty0) / 2,
      my1 = (sy1 + ty0) / 2;

    // console.log(argv)
    // console.log(s)
    // console.log(t)
    // console.log(sr)
    // console.log(sa0)
    // console.log(sa1)
    // console.log(sx0)
    // console.log(sy0)
    // console.log(tx0)
    // console.log(ty0)

    if (!context) context = buffer = path();

    if (sa0 == sa1)
      context.moveTo(sx0, sy0)
    else {
      context.moveTo(sx0, sy0);
      context.bezierCurveTo(sx0, my0, tx0, my0, tx0, ty0);
      context.lineTo(tx0, ty0);
      context.bezierCurveTo(tx0, my1, sx1, my1, sx1, sy1);
      context.arc(0, 0, sr, sa1, sa0, 1);
      context.closePath();
    }

    // context.moveTo(sx0, sy0);
    // context.arc(0, 0, sr, sa0, sa1);

    // context.bezierCurveTo(sx1, my1, tx0, my1, tx0, ty0);
    // context.bezierCurveTo(tx0, my0, sx0, my0, sx0, sy0);
    // context.closePath();


    if (buffer) return context = null, buffer + "" || null;
  }

  ribbon.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbon) : radius;
  };

  ribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : endAngle;
  };

  ribbon.source = function(_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
  };
  return ribbon;
}