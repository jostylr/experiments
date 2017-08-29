var Promise = require('bluebird');
Promise.longStackTraces();

var path = "data";
var fs = Promise.promisifyAll(require("fs"));
var largest =  fs.readdirAsync(path).
    map(function map  (file){
        console.log(file);
        return Promise.all([file, fs.statAsync(path+"/"+file)]);
    }).
    filter ( function filter (arr) {
        return arr[1].isFile();
    }).
    reduce(function reduce (x,y){
        return (x[1].size > y[1].size) ? x : y;
    }).
    then(function log (h) {
        console.log(h[0]);
    });

