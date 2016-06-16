(function() {
  var Enum,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Enum = (function() {
    function Enum() {
      this.__values = [];
    }

    Enum.prototype.__addValue = function(name, value) {
      if (typeof this[name] !== "undefined") {
        throw new Error(name + " has already been defined");
      }
      this[name] = value;
      return this.__values.push(value);
    };

    Enum.prototype.values = function() {
      return this.__values.slice(0);
    };

    return Enum;

  })();

  Enum.GenericEntry = (function() {
    function GenericEntry(__name) {
      this.__name = __name;
    }

    GenericEntry.prototype.getName = function() {
      return this.__name;
    };

    return GenericEntry;

  })();

  Enum.GenericIdEntry = (function(superClass) {
    extend(GenericIdEntry, superClass);

    function GenericIdEntry(__id, __name) {
      this.__id = __id;
      this.__name = __name;
    }

    GenericIdEntry.prototype.getId = function() {
      return this.__id;
    };

    return GenericIdEntry;

  })(Enum.GenericEntry);

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Enum;
  } else {
    window.Enum = Enum;
  }

}).call(this);
