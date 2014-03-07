
var supportedLanguageMap = {
  'js': require('./context/javascript'),
  'javascript': require('./context/javascript'),
  'php': require('./context/php'),
  '4d': require('./context/fourd'),
  '4D': require('./context/fourd'),
  'a4d': require('./context/fourd'),
  'a4D': require('./context/fourd')
};

exports.parseCodeContext = function(str, language) {
  language = language || 'javascript';
  if(!supportedLanguageMap.hasOwnProperty(language)) {
    throw 'Unsupported language: ' + language;
  }
  exports.parseCodeContext = supportedLanguageMap[language];
  return exports.parseCodeContext(str);
};

