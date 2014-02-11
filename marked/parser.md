# Parser access

This is a little experiment to see what can be done with marked and accessing the parser. It is a warmup for a new parsing of literate-programs. 

## Files

* [par.js](#parser-exp "save: |jshint ")
* [basic.js](#basic-parser-buildup "save : |jshint")
* [tokens.js](#accessing-the-parser-directly "save: |jshint")

## Parser Exp

Actually, maybe just replacing the renderer functions might work. We don't care about the output, but it could be one way to get the parsed bit. 

    var marked = require('marked');
    var renderer = new marked.Renderer();

    renderer.heading = function (text, level) {
      var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return '<h' + level + '><a name="' +
                    escapedText +
                     '" class="anchor" href="#' +
                     escapedText +
                     '"><span class="header-link"></span></a>' +
                      text + '</h' + level + '>';
    },

    console.log(marked('# heading+', { renderer: renderer }));

## Basic parser buildup

So we want to test the waters with a simple parsing of the fizzbuzz.md literate program

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

## Accessing the parser directly

So we can use the renderer as above, but it seems clunky, particularly not knowing whether a link is the only think in a paragraph. So let's check out the parser structure provided. 

    var marked = require('marked');
    var fs = require('fs');
    var blocks = {};

    var text = fs.readFileSync("fizzbuzz.md","utf8");

    var tokens = marked.lexer(text);
    console.log(tokens);

    console.log(marked.lexer('> i am using marked.'));

So the lexer is lexing the blocks. I think it then parses the text of each of the blocks for inline stuff. Seems reasonable. But I think this means I need to use the renderer function. It does not appear that there is any tree constructed. Of course, I could construct a tree...