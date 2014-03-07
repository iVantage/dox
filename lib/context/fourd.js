
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
  if(/^(C_[\S]+)/.exec(str)) {
    return {
        type: 'declaration'
      , constructor: RegExp.$1
      , cons: RegExp.$1
      , name: RegExp.$1
      , string: RegExp.$1
    };
  }
};

