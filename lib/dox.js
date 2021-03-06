/*!
 * Module dependencies.
 */

var markdown = require('marked')
  , escape = require('./utils').escape;

/**
 * Expose api.
 */

exports.api = require('./api');

/**
 * Parse comments in the given string of `js`.
 *
 * @param {String} js
 * @param {Object} options
 * @return {Array}
 * @see exports.parseComment
 * @api public
 */

exports.parseComments = function(js, options){
  options = options || {};
  js = js.replace(/\r\n/gm, '\n');

  var comments = []
    , raw = options.raw
    , comment
    , buf = ''
    , ignore
    , withinMultiline = false
    , withinSingle = false
    , code;

  for (var i = 0, len = js.length; i < len; ++i) {
    // start comment
    if (!withinMultiline && !withinSingle && '/' === js[i] && '*' === js[i+1]) {
      // code following previous comment
      if (buf.trim().length) {
        buf = '';
      }
      i += 2;
      withinMultiline = true;
      ignore = '!' === js[i];
    // end comment
    } else if (withinMultiline && !withinSingle && '*' === js[i] && '/' === js[i+1]) {
      i += 2;
      buf = buf.replace(/^[ \t]*\* ?/gm, '');
      comment = exports.parseComment(buf, options);
      comment.ignore = ignore;
      // Consider the rest of the file as possible code relating
      // to this docblock. If available, a filter function will
      // cut it down to just what is relevant.
      code = js.substring(i, js.length).trim();
      comment.ctx = exports.parseCodeContext(code, options.language);
      if(comment.ctx && comment.ctx.filter) {
        code = comment.ctx.filter(code);
      }
      comment.code = code;
      comments.push(comment);
      withinMultiline = ignore = false;
      buf = '';
    } else if (!withinSingle && !withinMultiline && '/' === js[i] && '/' === js[i+1]) {
      withinSingle = true;
      buf += js[i];
    } else if (withinSingle && !withinMultiline && '\n' === js[i]) {
      withinSingle = false;
      buf += js[i];
    // buffer comment or code
    } else {
      buf += js[i];
    }
  }

  if (comments.length === 0) {
    comments.push({
      tags: [],
      description: {full: '', summary: '', body: ''},
      isPrivate: false
    });
  }

  return comments;
};

/**
 * Parse the given comment `str`.
 *
 * The comment object returned contains the following
 *
 *  - `tags`  array of tag objects
 *  - `description` the first line of the comment
 *  - `body` lines following the description
 *  - `content` both the description and the body
 *  - `isPrivate` true when "@api private" is used
 *
 * @param {String} str
 * @param {Object} options
 * @return {Object}
 * @see exports.parseTag
 * @api public
 */

exports.parseComment = function(str, options) {
  str = str.trim();
  options = options || {};

  var comment = { tags: [] }
    , raw = options.raw
    , description = {};

  // parse comment body
  description.full = str.split('\n@')[0];
  description.summary = description.full.split('\n\n')[0];
  description.body = description.full.split('\n\n').slice(1).join('\n\n');
  comment.description = description;

  // parse tags
  if (~str.indexOf('\n@')) {
    var tags = '@' + str.split('\n@').slice(1).join('\n@');
    comment.tags = tags.split('\n').map(exports.parseTag);
    comment.isPrivate = comment.tags.some(function(tag){
      return 'api' === tag.type && 'private' === tag.visibility;
    });
  }

  // markdown
  if (!raw) {
    description.full = markdown(description.full);
    description.summary = markdown(description.summary);
    description.body = markdown(description.body);
  }

  return comment;
};

/**
 * Parse tag string "@param {Array} name description" etc.
 *
 * @param {String}
 * @return {Object}
 * @api public
 */

exports.parseTag = function(str) {
  var tag = {}
    , parts = str.split(/ +/)
    , type = tag.type = parts.shift().replace('@', '');

  switch (type) {
    case 'param':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.name = parts.shift() || '';
      tag.description = parts.join(' ');
      break;
    case 'return':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.description = parts.join(' ');
      break;
    case 'see':
      if (~str.indexOf('http')) {
        tag.title = parts.length > 1 ? parts.shift() : '';
        tag.url = parts.join(' ');
      } else {
        tag.local = parts.join(' ');
      }
      break;
    case 'api':
      tag.visibility = parts.shift();
      break;
    case 'type':
      tag.types = exports.parseTagTypes(parts.shift());
      break;
    case 'memberOf':
      tag.parent = parts.shift();
      break;
    case 'augments':
      tag.otherClass = parts.shift();
      break;
    case 'borrows':
      tag.otherMemberName = parts.join(' ').split(' as ')[0];
      tag.thisMemberName = parts.join(' ').split(' as ')[1];
      break;
    case 'throws':
      tag.types = exports.parseTagTypes(parts.shift());
      tag.description = parts.join(' ');
      break;
    default:
      tag.string = parts.join(' ');
      break;
  }

  return tag;
};

/**
 * Parse tag type string "{Array|Object}" etc.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

exports.parseTagTypes = function(str) {
  return str
    .replace(/[{}]/g, '')
    .split(/ *[|,\/] */);
};

/**
 * Parses context for given `str` of `language` code.
 *
 * The first time through we inspect the language type and choose a language
 * specific sub-routine. Subsequent calls will go directly the that sub-routine.
 *
 * @param {String} str The code to analyze
 * @param {String} language The language to use for context
 * @return {Object}
 */

exports.parseCodeContext = require('./context').parseCodeContext;
