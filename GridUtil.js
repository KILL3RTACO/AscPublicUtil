(function() {
  var GridUtil;

  GridUtil = (function() {
    function GridUtil() {}

    GridUtil.toIndex = function(x, y, w) {
      return (w * y) + x;
    };

    GridUtil.fromIndex = function(index, w) {
      return {
        x: index % w,
        y: Math.floor(index / w)
      };
    };

    GridUtil.isTop = function(y) {
      return y === 0;
    };

    GridUtil.isLeft = function(x) {
      return x === 0;
    };

    GridUtil.isBottom = function(y, h) {
      return y === h - 1;
    };

    GridUtil.isRight = function(x, w) {
      return x === w - 1;
    };

    GridUtil.isTopLeft = function(x, y) {
      return this.isTop(y) && this.isLeft(x);
    };

    GridUtil.isTopRight = function(x, y, w) {
      return this.isTop(y) && this.isRight(x, w);
    };

    GridUtil.isBottomLeft = function(x, y, h) {
      return this.isBottom(y, h) && this.isLeft(x);
    };

    GridUtil.isBottomRight = function(x, y, w, h) {
      return this.isBottom(y, h) && this.isRight(x, w);
    };

    GridUtil.isCorner = function(x, y, w, h) {
      return this.isTopLeft(x, y) || this.isTopRight(x, y, w) || this.isBottomLeft(x, y, h) || this.isBottomRight(x, y, w, h);
    };

    GridUtil.isOutOfBounds = function(x, y, w, h) {
      return x < 0 || y < 0 || x >= w || y >= h;
    };

    GridUtil.getUpDelta = function() {
      return {
        x: 0,
        y: -1
      };
    };

    GridUtil.getDownDelta = function() {
      return {
        x: 0,
        y: 1
      };
    };

    GridUtil.getLeftDelta = function() {
      return {
        x: -1,
        y: 0
      };
    };

    GridUtil.getRightDelta = function() {
      return {
        x: 1,
        y: 0
      };
    };

    GridUtil.getTopLeftDelta = function() {
      return {
        x: -1,
        y: -1
      };
    };

    GridUtil.getTopRightDelta = function() {
      return {
        x: 1,
        y: -1
      };
    };

    GridUtil.getBottomLeftDelta = function() {
      return {
        x: -1,
        y: 1
      };
    };

    GridUtil.getBottomRightDelta = function() {
      return {
        x: 1,
        y: 1
      };
    };

    return GridUtil;

  })();

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = GridUtil;
  } else {
    window.GridUtil = GridUtil;
  }

}).call(this);
