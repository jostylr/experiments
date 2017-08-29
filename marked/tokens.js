var marked = require('marked');
var fs = require('fs');
var blocks = {};

var text = fs.readFileSync("fizzbuzz.md","utf8");

var tokens = marked.lexer(text);
console.log(tokens);

console.log(marked.lexer('> i am [using](fake) marked.'));