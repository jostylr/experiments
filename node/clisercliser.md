# Client Server Exploration

This is an experiment for using node to pipe requests through to different servers or programs, etc. Basically, I want to make sure I understand all the piping and streaming. 

All of this will live in a single file:

FILE "Pieces" serve.js | jshint | jstidy


## Pieces

We do a require, boot up two servers, and then fire a request. 

JS

    var http = require('http');
    var urlparse = require('url');
    var fs = require('fs');

    var txtfile = 'clisercliser.md';

    _"Middleman Server"

    _"End Server"

    _"Send Request"

## Middleman Server

This takes in our generated client request and forwards them to the end server, getting the response back and sending that along. 

JS 

    var middle = http.createServer(function (req, res) {


        console.log(req.headers);


        (_"Send to End") (req, res); 

    }).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');


## Send to End

JS

    function (sreq, sres) {

        var options = {
          hostname: '127.0.0.1',
          port: 1338,  // change to say 1340 to get error
          path: '/test',
          method: 'GET'
        };


        var sender = http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            //res.setEncoding('utf8');
            sres.write("BODY");
            res.on('readable', function () {
                var chunk = res.read();
                console.log('BODY: ' + chunk.length);
                sres.write(chunk);
            });
            res.on('end', function () {
                sres.end();
            });
            res.on('close', function () {
                console.log("connection close");
            });
            res.on('error', function () {
                console.log("error");
            });


        });


        sender.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            sres.write("ERROR");
            sres.end();
        });

        // write data to request body
        //sender.write('data\n');
        //sender.write('data\n');
        sender.end();

    }



## End Server

This gets the forwarded request, reads a file, and sends it back. 

JS

    var end = http.createServer(function (req, res) {

        console.log(req.headers);

        var readData, go =false;

        fs.stat(txtfile, function (err, stats) {
            res.setHeader('Content-Length', stats.size);
            res.writeHead(200);
            readData();
            go = true;
        });

        var rs = fs.createReadStream(txtfile);


        var readData = function () {
            var chunk = rs.read();
            if (chunk) {
                res.write(chunk);
            }
            console.log("hey ho", go);
        };

        rs.on('readable', function () {
            console.log('just hey');
            if (go) {
                readData();
            }
        });

        rs.on('end', function () {
            res.end();
        });


    }).listen(1338, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1338/');

## Send Request

Send a request. Upon its return, shut it all down.

JS

    var options = {
      hostname: '127.0.0.1',
      port: 1337,
      path: '/test',
      method: 'GET'
    };


    var sender = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var response  = '';
        res.on('readable', function () {
            response += res.read();
        });
        res.on('end', function () {
            console.log(response.length, response.slice(0, 5));
            middle.close();
            end.close();
        });
    });


    sender.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    //sender.write('data\n');
    //sender.write('data\n');
    sender.end();

