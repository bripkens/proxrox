'use strict';

var path = require('path');

exports.isRelative = function(p) {
  var normal = path.normalize(p);
  var absolute = path.resolve(p);
  return normal !== absolute;
};
