
/**
 * Parse the context from the given `str` of php.
 *
 * This method attempts to discover the context
 * for the comment based on it's code. Currently
 * supports:
 *
 * - class statements
 * - ...
 *
 * @param {String} str
 * @return {Object}
 */

module.exports = function(str) {
  str = str.split('\n')[0];

  // class statement
  if(/^class\s+(\w+)/.exec(str)) {
    return {
        type: 'class'
      , constructor: RegExp.$1
      , cons: RegExp.$1
      , name: RegExp.$1
      , string: RegExp.$1 + '()'
    };
  }
};
