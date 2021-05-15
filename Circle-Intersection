function circleIntersection(x1,y1,r1, x2,y2,r2) {
  var d = r2**2 - r1**2 + x1**2 - x2**2 + y1**2 - y2**2;
  var e = 2*(y1 - y2);
  var e2 = e**2;
  var a = e2 + 4*x2**2 - 8*x1*x2 + 4*x1**2;
  var b = 4*x2*d - 4*x1*d - e2*2*x1 + 4*y1*x1*e - 4*y1*x2*e;
  var c = x1**2*e2 + d**2 - 2*y1*d*e + y1**2*e2 - r1**2*e2;
  let n = Math.sqrt(b**2 - 4*a*c);
  var fx1 = (-b + n)/(2*a);
  var fx2 = (-b - n)/(2*a);
  var fy1 = (2*x2*fx1 - 2*x1*fx1 + d)/e;
  var fy2 = (2*x2*fx2 - 2*x1*fx2 + d)/e;
  return [[fx1, fy1], [fx2, fy2]];
}
