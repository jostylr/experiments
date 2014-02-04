var jade = require('jade');
var fs = require('fs');

var file = fs.readFileSync("test.jade", "utf8");

var out = jade.compile(file, {pretty:true});

console.log(out({name:"james"}));