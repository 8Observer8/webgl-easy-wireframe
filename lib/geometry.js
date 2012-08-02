// Generated by CoffeeScript 1.3.3

exports.AABB = (function() {

  function AABB(xmin, xmax, ymin, ymax, zmin, zmax) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.zmin = zmin;
    this.zmax = zmax;
  }

  AABB.prototype.ray_intersect = function(ray) {
    var d, inv_x, inv_y, inv_z, o, tmax, tmin, ymax, ymin, zmax, zmin, _ref, _ref1, _ref2;
    o = ray.origin;
    d = ray.direction;
    inv_x = 1.0 / d.x;
    tmin = (this.xmin - o.x) * inv_x;
    tmax = (this.xmax - o.x) * inv_x;
    if (inv_x < 0) {
      _ref = [tmax, tmin], tmin = _ref[0], tmax = _ref[1];
    }
    inv_y = 1.0 / d.y;
    ymin = (this.ymin - o.y) * inv_y;
    ymax = (this.ymax - o.y) * inv_y;
    if (inv_y < 0) {
      _ref1 = [ymax, ymin], ymin = _ref1[0], ymax = _ref1[1];
    }
    if (tmin > ymax || ymin > tmax) {
      return null;
    }
    if (ymin > tmin) {
      tmin = ymin;
    }
    if (ymax < tmax) {
      tmax = ymax;
    }
    inv_z = 1.0 / d.z;
    zmin = (this.zmin - o.z) * inv_z;
    zmax = (this.zmax - o.z) * inv_z;
    if (inv_z < 0) {
      _ref2 = [zmax, zmin], zmin = _ref2[0], zmax = _ref2[1];
    }
    if (tmin > zmax || zmin > tmax) {
      return null;
    }
    if (zmin > tmin) {
      tmin = zmin;
    }
    if (zmax < tmax) {
      tmax = zmax;
    }
    return [tmin, tmax];
  };

  return AABB;

})();

exports.Ray = (function() {

  function Ray(origin, direction) {
    var _ref, _ref1;
    this.origin = origin;
    this.direction = direction;
    if ((_ref = this.origin) == null) {
      this.origin = new Vec4();
    }
    if ((_ref1 = this.direction) == null) {
      this.direction = new Vec4();
    }
  }

  Ray.prototype.interpolate = function(interval, vector) {
    var d, o, v;
    if (vector == null) {
      vector = new Vec4();
    }
    o = this.origin;
    d = this.direction;
    v = vector;
    v.x = o.x + d.x * interval;
    v.y = o.y + d.y * interval;
    v.z = o.z + d.z * interval;
    v.w = o.w + d.w * interval;
    return vector;
  };

  Ray.prototype.ray_nearest = function(ray) {
    var U, V, W, a, b, c, d, det, e, s, t;
    W = this.origin.sub(ray.origin, new Vec4);
    U = this.direction;
    V = ray.direction;
    a = U.dot(U);
    b = U.dot(V);
    c = V.dot(V);
    d = U.dot(W);
    e = V.dot(W);
    det = a * c - b * b;
    if (det === 0) {
      return null;
    }
    s = (b * e - c * d) / det;
    t = (a * e - b * d) / det;
    return [s, t];
  };

  Ray.prototype.point_distance = function(point) {
    var W, s;
    W = point.sub(this.origin, new Vec4);
    s = W.dot(this.direction) / this.direction.dot(this.direction);
    W.x -= this.direction.x * s;
    W.y -= this.direction.y * s;
    W.z -= this.direction.z * s;
    return Math.sqrt(W.dot(W));
  };

  return Ray;

})();

exports.get_mouseray = function(x, y, inv_proj, inv_view, ray) {
  if (ray == null) {
    ray = new exports.Ray;
  }
  inv_proj.mulVal4(x, y, -1, 1, ray.direction);
  inv_view.mulVec3(ray.direction);
  ray.direction.w = 0;
  inv_view.mulVal4(0, 0, 0, 1, ray.origin);
  return ray;
};