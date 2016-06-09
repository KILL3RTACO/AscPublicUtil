(function() {
  var MapRenderer;

  MapRenderer = (function() {
    MapRenderer.SQUARE = 0;

    MapRenderer.CIRCLE = 1;

    MapRenderer.DIAMOND = 2;

    MapRenderer.TRIANGLE_UP = 3;

    MapRenderer.TRIANGLE_LEFT = 4;

    MapRenderer.TRIANGLE_RIGHT = 5;

    MapRenderer.TRIANGLE_DOWN = 6;

    MapRenderer.TRIANGLE_UP_EQ = 7;

    MapRenderer.TRIANGLE_LEFT_EQ = 8;

    MapRenderer.TRIANGLE_RIGHT_EQ = 9;

    MapRenderer.TRIANGLE_DOWN_EQ = 10;

    MapRenderer.TOP = 0;

    MapRenderer.LEFT = 1;

    MapRenderer.BOTTOM = 2;

    MapRenderer.RIGHT = 3;

    function MapRenderer(__width, __height) {
      this.__width = __width;
      this.__height = __height;
      this.__borderSize = 1;
      this.__cellSize = 20;
      this.__voidColor = "#FFF";
      this.__inactiveBorderColor = "#AAA";
      this.__borderColor = "#000";
      this.__colors = [];
    }

    MapRenderer.prototype.setWidth = function(__width) {
      this.__width = __width;
      return this.__updateSize();
    };

    MapRenderer.prototype.getWidth = function() {
      return this.__width;
    };

    MapRenderer.prototype.setHeight = function(__height) {
      this.__height = __height;
      return this.__updateSize();
    };

    MapRenderer.prototype.getHeight = function() {
      return this.__height;
    };

    MapRenderer.prototype.__updateSize = function() {
      this.__ctx.canvas.width = this.getOffset(this.getWidth());
      this.__ctx.canvas.height = this.getOffset(this.getHeight());
    };

    MapRenderer.prototype.setVoidColor = function(__voidColor) {
      this.__voidColor = __voidColor;
      return this;
    };

    MapRenderer.prototype.getVoidColor = function() {
      return this.__voidColor;
    };

    MapRenderer.prototype.setColorData = function(__colors) {
      this.__colors = __colors;
    };

    MapRenderer.prototype.getColorData = function() {
      return this.__colors;
    };

    MapRenderer.prototype.getOffset = function(amount) {
      return ((this.getCellSize() + this.getBorderSize()) * amount) + this.getBorderSize();
    };

    MapRenderer.prototype.getOffsetPoint = function(x, y) {
      return {
        x: this.getOffset(x),
        y: this.getOffset(y)
      };
    };

    MapRenderer.prototype.getCenter = function(amount) {
      return this.getOffset(amount) + (this.__cellSize / 2);
    };

    MapRenderer.prototype.getCenterPoint = function(x, y) {
      return {
        x: this.getCenter(x),
        y: this.getCenter(y)
      };
    };

    MapRenderer.prototype.setCanvas = function(canvas) {
      this.__ctx = canvas.getContext("2d");
      this.__updateSize();
      return this;
    };

    MapRenderer.prototype.getContext = function() {
      return this.__ctx;
    };

    MapRenderer.prototype.color = function(x, y, color) {
      return this.colorRaw(x, y, this.__colors.getColor(color));
    };

    MapRenderer.prototype.colorRaw = function(x, y, color) {
      this.__ctx.save();
      this.__ctx.fillStyle = color;
      this.__ctx.fillRect(this.getOffset(x), this.getOffset(y), this.__cellSize, this.__cellSize);
      return this.__ctx.restore();
    };

    MapRenderer.prototype.colorBorder = function(x, y, color, direction) {
      return this.colorBorderRaw(x, y, this.__colors.getColor(color), direction);
    };

    MapRenderer.prototype.colorBorderRaw = function(x, y, color, direction) {
      var d, i, len, ref;
      this.__ctx.save();
      this.__ctx.fillStyle = color;
      if (direction === this.constructor.TOP) {
        this.__ctx.fillRect(this.getOffset(x) - this.__borderSize, this.getOffset(y) - this.__borderSize, this.__cellSize + (this.__borderSize * 2), this.__borderSize);
      } else if (direction === this.constructor.LEFT) {
        this.__ctx.fillRect(this.getOffset(x) - this.__borderSize, this.getOffset(y) - this.__borderSize, this.__borderSize, this.__cellSize + (this.__borderSize * 2));
      } else if (direction === this.constructor.BOTTOM) {
        this.__ctx.fillRect(this.getOffset(x) - this.__borderSize, this.getOffset(y) + this.__cellSize, this.__cellSize + (this.__borderSize * 2), this.__borderSize);
      } else if (direction === this.constructor.RIGHT) {
        this.__ctx.fillRect(this.getOffset(x) + this.__cellSize, this.getOffset(y) - this.__borderSize, this.__borderSize, this.__cellSize + (this.__borderSize * 2));
      } else {
        ref = [this.constructor.TOP, this.constructor.LEFT, this.constructor.RIGHT, this.constructor.BOTTOM];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          this.colorBorderRaw(x, y, color, d);
        }
      }
      return this.__ctx.restore();
    };

    MapRenderer.prototype.colorMarker = function(x, y, color, style) {
      return this.colorMakerRaw(x, y, this.getColor(color), style);
    };

    MapRenderer.prototype.colorMarkerRaw = function(x, y, color, style) {
      var bottom, left, midX, midY, om, ox, oy, right, size, top, triEq, triMod;
      ox = this.getOffset(x);
      oy = this.getOffset(y);
      om = this.__cellSize / 4;
      size = this.__cellSize / 2;
      top = oy + om;
      left = ox + om;
      midX = ox + size;
      midY = oy + size;
      right = (ox + this.__cellSize) - om;
      bottom = (oy + this.__cellSize) - om;
      this.__ctx.save();
      this.__ctx.fillStyle = color;
      triEq = style === this.constructor.TRIANGLE_UP_EQ || style === this.constructor.TRIANGLE_LEFT_EQ || style === this.constructor.TRIANGLE_RIGHT_EQ || style === this.constructor.TRIANGLE_DOWN_EQ;
      triMod = (triEq ? om / 2 : 0);
      if (style === this.constructor.CIRCLE) {
        this.__ctx.beginPath();
        this.__ctx.arc(midX, midY, om, 0, 2 * Math.PI);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else if (style === this.constructor.DIAMOND) {
        this.__ctx.beginPath();
        this.__ctx.moveTo(left, midY);
        this.__ctx.lineTo(midX, top);
        this.__ctx.lineTo(right, midY);
        this.__ctx.lineTo(midX, bottom);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else if (style === this.constructor.TRIANGLE_UP || style === this.constructor.TRIANGLE_UP_EQ) {
        this.__ctx.beginPath();
        this.__ctx.moveTo(left, bottom - triMod);
        this.__ctx.lineTo(midX, top + triMod);
        this.__ctx.lineTo(right, bottom - triMod);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else if (style === this.constructor.TRIANGLE_LEFT || style === this.constructor.TRIANGLE_LEFT_EQ) {
        this.__ctx.beginPath();
        this.__ctx.moveTo(left + triMod, midY);
        this.__ctx.lineTo(right - triMod, top);
        this.__ctx.lineTo(right - triMod, bottom);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else if (style === this.constructor.TRIANGLE_RIGHT || style === this.constructor.TRIANGLE_RIGHT_EQ) {
        this.__ctx.beginPath();
        this.__ctx.moveTo(left + triMod, top);
        this.__ctx.lineTo(right - triMod, midY);
        this.__ctx.lineTo(left + triMod, bottom);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else if (style === this.constructor.TRIANGLE_DOWN || style === this.constructor.TRIANGLE_DOWN_EQ) {
        this.__ctx.beginPath();
        this.__ctx.moveTo(left, top + triMod);
        this.__ctx.lineTo(right, top + triMod);
        this.__ctx.lineTo(midX, bottom - triMod);
        this.__ctx.closePath();
        this.__ctx.fill();
      } else {
        this.__ctx.fillRect(ox + om, oy + om, size, size);
      }
      return this.__ctx.restore();
    };

    MapRenderer.prototype.setBorderSize = function(size) {
      this.__borderSize = Number.isInteger(size) && size > 0 ? size : 1;
      this.__updateSize();
      return this;
    };

    MapRenderer.prototype.getBorderSize = function() {
      return this.__borderSize;
    };

    MapRenderer.prototype.setBorderColor = function(__borderColor) {
      this.__borderColor = __borderColor;
      return this;
    };

    MapRenderer.prototype.getBorderColor = function() {
      return this.__borderColor;
    };

    MapRenderer.prototype.setCellSize = function(size) {
      this.__cellSize = Number.isInteger(size) && size > 0 ? size : 1;
      this.__updateSize();
      return this;
    };

    MapRenderer.prototype.getCellSize = function() {
      return this.__cellSize;
    };

    MapRenderer.prototype.colorPath = function(path, color) {
      return drawPathRaw(path, this.getColor(color));
    };

    MapRenderer.prototype.colorPathRaw = function(path, color) {
      var i, len, prev, ref, x, y;
      if (path === null || path.length < 2) {
        return;
      }
      this.__ctx.save();
      this.__ctx.strokeStyle = color;
      this.__ctx.beginPath();
      prev = null;
      for (i = 0, len = path.length; i < len; i++) {
        ref = path[i], x = ref.x, y = ref.y;
        if (prev === null) {
          prev = this.getCenterPoint(x, y);
          this.__ctx.moveTo(prev.x, prev.y);
        } else {
          this.__ctx.lineTo(prev.x, prev.y);
          prev = this.getCenterPoint(x, y);
        }
      }
      this.__ctx.lineTo(prev.x, prev.y);
      this.__ctx.stroke();
      this.__ctx.closePath();
      return this.__ctx.restore();
    };

    MapRenderer.prototype.getCellLocation = function(pixelX, pixelY) {
      return {
        x: Math.floor(pixelX / (this.__cellSize + this.__borderSize)),
        y: Math.floor(pixelY / (this.__cellSize + this.__borderSize))
      };
    };

    return MapRenderer;

  })();

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = MapRenderer;
  } else {
    window.MapRenderer = MapRenderer;
  }

}).call(this);
