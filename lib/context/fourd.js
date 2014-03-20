
/**
 * Parse the context from the given `str` of 4D.
 *
 * This method attempts to discover the context
 * for the comment based on it's code. Currently
 * supports:
 *
 * - declarations
 * - ...
 *
 * @param {String} str
 * @return {Object}
 */

module.exports = function(str) {
  str = str.split('\n')[0];

  // variable declarations
  if(/^(C_[\S]+)/.exec(str)) {
    return {
        type: 'declaration'
      , constructor: RegExp.$1
      , cons: RegExp.$1
      , name: RegExp.$1
      , string: RegExp.$1
      , filter: codeLine
    };
  }

  /**
   * Parse a chunk of code for a statement terminated by a newline.
   *
   * @param {string} code A chunk of code
   * @return {string}
   */
  function codeLine(code) {
    var charr;

    for (var i = 0, len = code.length; i < len; i++) {
      charr = code[i];
      if('\n' === charr) {
        return code.substring(0, i+1);
      }
    }

    throw 'Error: Expected a newline character but found none';
  };
};

