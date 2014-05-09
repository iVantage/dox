
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
  // function
  } else if (/^(public|private|protected)\s+.*function ([\w$]+) *\(/.exec(str)) {
    return {
        type: 'function'
      , name: RegExp.$2
      , string: RegExp.$2 + '()'
      , filter: codeBlock
    };
  // declaration
  } else if (/^(public|private|protected)\s+\$([\w$]+);/.exec(str)) {
    return {
        type: 'property'
      , name: RegExp.$2
      , string: RegExp.$2
      , filter: codeLine
    };
  }

  /**
   * Parse a chunk of code for a block enclosed by curly braces.
   *
   * Returns the substring of the code from the beginning to the location
   * of the curly brace that closes the first block.
   *
   * @param {string} code A chunk of code
   * @return {string}
   */
  function codeBlock(code) {
    var stack = []
      , charr;

    // Iterate through each character in the for
    for (var i = 0, len = code.length; i < len; i++) {
      charr = code[i];
      if('{' === charr) {
        stack.push(charr);
      }
      else if('}' === charr) {
        stack.pop();
        if(0 === stack.length) {
          return code.substring(0, i+1);
        }
      }
    };

    throw "Error parsing code: Missing closing brace";
  };

  /**
   * Parse a chunk of code for a statement terminated by a semicolon.
   *
   * @param {string} code A chunk of code
   * @return {string}
   */
  function codeLine(code) {
    var charr;

    for (var i = 0, len = code.length; i < len; i++) {
      charr = code[i];
      if(';' === charr) {
        return code.substring(0, i+1);
      }
    }

    throw 'Error: Expected semicolon but found none';
  };
};
