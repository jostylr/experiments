var marked = require('marked');
var renderer = new marked.Renderer();
var fs = require('fs');
var blocks = {};

var current = blocks._initial = [];

renderer.heading = function (text, level, raw) {
    console.log(text);
    i
    current = blocks[text] = [];
    return "";
};

var c = renderer.code;
renderer.code = function (code, language) {

}

var clink; 
var l = renderer.link;
renderer.link = function (href, title, text) {
    clink = [href, title, text];
    return "!~!"+text;
};

renderer.p = renderer.paragraph;
renderer.paragraph = function (text) {
    if (text === "!~!"+clink[2]) {
        console.log("switch: ", clink);
    }
    return "";
};

var file = fs.readFileSync("fizzbuzz.md","utf8");

marked(file, {renderer:renderer});

console.log(blocks);