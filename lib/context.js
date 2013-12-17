
var supportedLanguageMap = {
  'js': require('./context/javascript'),
  'javascript': require('./context/javascript'),
  'php': require('./context/php')
};

exports.parseCodeContext = function(str, language) {
  language = language || 'javascript';
  if(!supportedLanguageMap.hasOwnProperty(language)) {
    throw 'Unsupported language: ' + language;
  }
  exports.parseCodeContext = supportedLanguageMap[language];
  return exports.parseCodeContext(str);
};

