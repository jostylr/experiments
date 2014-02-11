var marked = require('marked');
var renderer = new marked.Renderer();
var fs = require('fs');
var blocks = {};

var current = blocks._initial = [];

renderer.heading = function (text, level, raw) {
    console.log(text);
    current = blocks[text] = [];
    return "";
};

var c = renderer.code;
renderer.code = function (code, language) {

}

var clink; 
var l = renderer.link;
renderer.link = function (href, title, text) {
    if (title) {
        title = title.replace(/&quot;/g, "\"");
    } else {
        title = "";
    }
    clink = [href, title, text];
    return text;
};

var plain = function (text) {
    return text;
}; 

["strong", "em", "codespan", "del"].forEach(function (el) {
    renderer[el] = plain;
});

renderer.paragraph = function (text) {
    if (text === clink[2]) {
        console.log("switch: ", clink);
    }
    clink = [];
    return "";
};

var file = fs.readFileSync("links.md","utf8");

marked(file, {renderer:renderer});

console.log(blocks);