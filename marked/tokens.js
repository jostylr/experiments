var marked = require('marked');
var fs = require('fs');
var blocks = {};

var text = fs.readFileSync("fizzbuzz.md","utf8");

var tokens = marked.lexer(text);
console.log(tokens);
//marked.parser(tokens));

console.log(marked.lexer('> i am using marked.'));