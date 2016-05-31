(function() {
  var D, D2_CHEBYSHEV, D2_OCTILE, Grid, Node, Pathfinder, PriorityList, abs, fromIndex, getIndex, getPath, h, heuristic, max, min, sqrt;

  abs = Math.abs, min = Math.min, max = Math.max, sqrt = Math.sqrt;

  getIndex = function(x, y, width) {
    return (y * width) + x;
  };

  fromIndex = function(index, width) {
    return {
      x: index % width,
      y: Math.floor(index / width)
    };
  };

  D = 1;

  D2_CHEBYSHEV = 1;

  D2_OCTILE = 1.4;

  heuristic = function(a, b, formula) {
    var D2, dx, dy;
    if (typeof formula === "function") {
      return formula.call(null, a, b);
    }
    if (formula === Pathfinder.OCTILE || formula === Pathfinder.CHEBYSHEV) {
      D2 = formula === Pathfinder.OCTILE ? D2_OCTILE : D2_CHEBYSHEV;
      dx = abs(a.x - b.x);
      dy = abs(a.y - b.y);
      return D * (dx + dy) + (D2 - 2 * D) * min(dx, dy);
    } else {
      return abs(a.x - b.x) + abs(a.y - b.y);
    }
  };

  h = heuristic;

  PriorityList = (function() {
    function PriorityList(list) {
      if (list == null) {
        list = [];
      }
      this.__list = list;
      if (this.size() > 0) {
        this.sort();
      }
    }

    PriorityList.prototype.put = function(data, priority) {
      this.__list.push({
        data: data,
        priority: priority
      });
    };

    PriorityList.prototype.get = function() {
      return this.__list.shift().data;
    };

    PriorityList.prototype.sort = function() {
      return this.__list.sort(function(a, b) {
        return a.priority - b.priority;
      });
    };

    PriorityList.prototype.size = function() {
      return this.__list.length;
    };

    PriorityList.prototype.isEmpty = function() {
      return this.size() === 0;
    };

    return PriorityList;

  })();

  getPath = function(cameFrom, start, goal, grid) {
    var current, i, index, len, pair, path, realPath;
    current = goal;
    path = [current];
    while (current !== start) {
      current = cameFrom[current];
      path.push(current);
    }
    path.reverse();
    realPath = [];
    for (i = 0, len = path.length; i < len; i++) {
      index = path[i];
      pair = fromIndex(index, grid.getWidth());
      realPath.push(grid.get(pair.x, pair.y));
    }
    return realPath;
  };

  Pathfinder = (function() {
    Pathfinder.MANHATTAN = 0;

    Pathfinder.OCTILE = 1;

    Pathfinder.CHEBYSHEV = 2;

    function Pathfinder(arg) {
      var distanceFormula, impossibleCost, ref;
      this.__grid = arg.grid, distanceFormula = (ref = arg.distanceFormula) != null ? ref : this.constructor.MANHATTAN, impossibleCost = arg.impossibleCost;
      if (this.__grid === void 0 || this.__grid === null) {
        throw new Error("Pathfinder needs a grid");
      }
      if (!(this.__grid instanceof Pathfinder.Grid)) {
        throw new Error("options.grid must be an instance of Pathfinder.Grid");
      }
      this.__dFormula = Number.isInteger(distanceFormula) || typeof distanceFormula === "function" ? distanceFormula : this.constructor.MANHATTAN;
      this.__impossibleCost = Number.isInteger(impossibleCost) ? impossibleCost : 10000;
    }

    Pathfinder.prototype.getGrid = function() {
      return this.__grid;
    };

    Pathfinder.prototype.findPath = function(start, goal) {
      var cameFrom, current, currentIndex, frontier, frontierChanged, i, len, newCost, next, nextCost, nextIndex, priority, ref, startIndex, totalCost;
      frontier = new PriorityList([
        {
          data: start,
          priority: 0
        }
      ]);
      cameFrom = [];
      totalCost = [];
      startIndex = getIndex(start.x, start.y, this.__grid.getWidth());
      cameFrom[startIndex] = null;
      totalCost[startIndex] = 0;
      while (!frontier.isEmpty()) {
        current = frontier.get();
        currentIndex = getIndex(current.x, current.y, this.__grid.getWidth());
        if (current === goal) {
          return getPath(cameFrom, startIndex, getIndex(goal.x, goal.y, this.__grid.getWidth()), this.__grid);
        }
        frontierChanged = false;
        ref = this.__grid.getAllowedNeighbors(current.x, current.y);
        for (i = 0, len = ref.length; i < len; i++) {
          next = ref[i];
          nextIndex = getIndex(next.x, next.y, this.__grid.getWidth());
          newCost = totalCost[currentIndex] + next.getMovementCost();
          if (next === null || next === void 0 || next.isWall() || newCost >= this.__impossibleCost) {
            continue;
          }
          nextCost = totalCost[nextIndex];
          if (nextCost === null || nextCost === void 0 || newCost < nextCost) {
            totalCost[nextIndex] = newCost;
            priority = newCost + h(next, goal, this.__dFormula);
            frontier.put(next, priority);
            cameFrom[nextIndex] = currentIndex;
            frontierChanged = true;
          }
        }
        if (frontierChanged) {
          frontier.sort();
        }
      }
      return null;
    };

    return Pathfinder;

  })();

  Pathfinder.Node = Node = (function() {
    Node.WALL = -1;

    Node.UP = 0;

    Node.DOWN = 1;

    Node.LEFT = 2;

    Node.RIGHT = 3;

    Node.TOP_LEFT = 4;

    Node.TOP_RIGHT = 5;

    Node.BOTTOM_LEFT = 6;

    Node.BOTTOM_RIGHT = 7;

    Node.defaultOptions = function() {
      var i, k, len, options, ref;
      options = {
        x: 0,
        y: 0
      };
      ref = ["up", "down", "left", "right", "topLeft", "topRight", "bottomLeft", "bottomRight"];
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        options[k] = true;
      }
      return options;
    };

    Node.fromObject = function(object) {
      var directions, k, keys, v, val;
      if (object === null) {
        return null;
      }
      if (object.wall) {
        return new this(object.x, object.y, null, object.movementCost);
      }
      directions = [];
      keys = {
        up: this.UP,
        down: this.DOWN,
        left: this.LEFT,
        right: this.RIGHT,
        topLeft: this.TOP_LEFT,
        topRight: this.TOP_RIGHT,
        bottomLeft: this.BOTTOM_LEFT,
        bottomRight: this.BOTTOM_RIGHT
      };
      for (k in keys) {
        v = keys[k];
        val = object[k];
        directions[v] = val === null || val === void 0 ? true : val;
      }
      return new this(object.x, object.y, directions);
    };

    Node.getDeltas = function(dir) {
      if (dir === this.DOWN) {
        return {
          x: 0,
          y: 1
        };
      }
      if (dir === this.UP) {
        return {
          x: 0,
          y: -1
        };
      }
      if (dir === this.LEFT) {
        return {
          x: -1,
          y: 0
        };
      }
      if (dir === this.BOTTOM_LEFT) {
        return {
          x: -1,
          y: 1
        };
      }
      if (dir === this.TOP_LEFT) {
        return {
          x: -1,
          y: -1
        };
      }
      if (dir === this.RIGHT) {
        return {
          x: 1,
          y: 0
        };
      }
      if (dir === this.BOTTOM_RIGHT) {
        return {
          x: 1,
          y: 1
        };
      }
      if (dir === this.TOP_RIGHT) {
        return {
          x: 1,
          y: -1
        };
      }
    };

    function Node(x1, y1, __directions, __movementCost) {
      this.x = x1;
      this.y = y1;
      this.__directions = __directions != null ? __directions : [false, false, false, false, false, false, false, false];
      this.__movementCost = __movementCost != null ? __movementCost : 1;
    }

    Node.prototype.setDirectionAllowed = function(direction, allowed) {
      if (allowed == null) {
        allowed = true;
      }
      return this.__directions[direction] = allowed === true;
    };

    Node.prototype.canGo = function(direction) {
      return this.__directions[direction];
    };

    Node.prototype.setMovementCost = function(__movementCost) {
      this.__movementCost = __movementCost;
    };

    Node.prototype.getMovementCost = function() {
      return this.__movementCost;
    };

    Node.prototype.getAllowedNeighbors = function() {
      var allowed;
      allowed = [];
      if (this.canGo(this.constructor.TOP_LEFT)) {
        allowed.push({
          x: this.x - 1,
          y: this.y - 1
        });
      }
      if (this.canGo(this.constructor.UP)) {
        allowed.push({
          x: this.x,
          y: this.y - 1
        });
      }
      if (this.canGo(this.constructor.TOP_RIGHT)) {
        allowed.push({
          x: this.x + 1,
          y: this.y - 1
        });
      }
      if (this.canGo(this.constructor.LEFT)) {
        allowed.push({
          x: this.x - 1,
          y: this.y
        });
      }
      if (this.canGo(this.constructor.RIGHT)) {
        allowed.push({
          x: this.x + 1,
          y: this.y
        });
      }
      if (this.canGo(this.constructor.BOTTOM_LEFT)) {
        allowed.push({
          x: this.x - 1,
          y: this.y + 1
        });
      }
      if (this.canGo(this.constructor.DOWN)) {
        allowed.push({
          x: this.x,
          y: this.y + 1
        });
      }
      if (this.canGo(this.constructor.BOTTOM_RIGHT)) {
        allowed.push({
          x: this.x + 1,
          y: this.y + 1
        });
      }
      return allowed;
    };

    Node.prototype.isWall = function() {
      return this.getAllowedNeighbors().length === 0;
    };

    return Node;

  })();

  Pathfinder.Grid = Grid = (function() {
    function Grid(__grid, __width, __height) {
      this.__grid = __grid;
      this.__width = __width;
      this.__height = __height;
    }

    Grid.prototype.getHeight = function() {
      return this.__height;
    };

    Grid.prototype.getWidth = function() {
      return this.__width;
    };

    Grid.prototype.getNodes = function(list) {
      var found, i, len, n, ref, x, y;
      if (!Array.isArray(list)) {
        throw new Error("list must be an array");
      }
      found = [];
      for (i = 0, len = list.length; i < len; i++) {
        ref = list[i], x = ref.x, y = ref.y;
        if (x < 0 || x >= this.__width || y < 0 || y >= this.__height) {
          continue;
        }
        n = this.get(x, y);
        if (n === null || n === void 0) {
          continue;
        }
        found.push(n);
      }
      return found;
    };

    Grid.prototype.getAllowedNeighbors = function(x, y) {
      var node;
      node = this.get(x, y);
      if (node === null || node === void 0) {
        return null;
      }
      return this.getNodes(node.getAllowedNeighbors());
    };

    Grid.prototype.get = function(x, y) {
      return this.__grid[getIndex(x, y, this.__width)];
    };

    Grid.prototype.set = function(x, y, node) {
      this.__grid[getIndex(x, y, this.__width)] = node;
      return this;
    };

    return Grid;

  })();

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Pathfinder;
  } else {
    window.Pathfinder = Pathfinder;
  }

}).call(this);
