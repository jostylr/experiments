var marked = require('marked');
var renderer = new marked.Renderer();
var fs = require('fs');
var blocks = {};

var current = blocks._initial = [];

renderer.heading = function (text, level, raw) {
    console.log(text, level);
    current = blocks[text] = [];
    return "";
};

renderer.code = function (code, language) {
    current.push(code);
};

renderer.html = function (text) {
    var pos;
    console.log("HTML"+ text + "!HTML"); 
    if (text.slice(0,5) === "<pre>") {
        pos = text.indexOf("</pre>");
        console.log("pre", text.slice(5, pos));
        current.push(text.slice(5, pos));
    }
};

var clink; 
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