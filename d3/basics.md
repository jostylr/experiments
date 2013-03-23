# Basic d3 examples

Here we just want to explore with some simple d3 snippets. 

## Skeleton

HTML top

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>!title</title>
            <script src="d3.v3.js"></script>
            <script src="rgbcolor.js"></script>
            <script src="canvg.js"></script>
        </head>
        <body>
            
HTML bottom

        </body>
    </html>


## First run

Let's just make somthing that works.

FILE "" first.html 

    _"skeleton:top |substitute(!title, First SVG)"

    _":body"

    _":script"

    _"skeleton:bottom"

MD body | 1 marked()

Some boiler plate text    

    First some intro

    then some other great stuff

    __":circle"

    ipso facto

    And this one?

JS script | jshint() | wrap(script)

    d3.selectAll("p")
        .data([16, 23, 42])
        .style("font-size", function(d) { return d + "px"; });

    d3.selectAll("circle")
        .style("stroke", "darkseagreen")
        .data([10, 15, 20])
        .attr("r", function(d) {return d+"px";})
        .attr("cx", function(d) {return 10*d*Math.random() + "px";})
        .append("svg:text").text(function(d) {return d;});

.SVG circle 

    <svg height="50px">
        <circle r="10" cx="10" cy="20" fill="darkorange"/>
        <circle r="10" cx="20" cy="20" fill="darkorange"/>
        <circle r="10" cx="30" cy="20" fill="darkorange"/>

    <svg>


## Build a bar chart


FILE "" bar.html 

    _"skeleton:top |substitute(!title, Bar Chart)"

    _":body"

    _":script"

    _"skeleton:bottom"

MD body | marked()

    We want to build a bar chart. Our data will be 

    <table id="data"></table>


    Our data goes from 0 to 20 and we want lengths to be of length 2. So 10 bars. 

    The tabulated data is 

    <table id="counts"></table>


    The chart is

    <style type='text/css'>/*stolen from http://code.hazzens.com/d3tut/lesson_2.html*/

      .axis .domain, .axis .tick {
        stroke: #000;
        fill: none;
        font-family : Verdana, sans-serif;
        font-size: 32px;

      }

      td { text-align: right}
    </style>

    <div id="chart"></div>

    <canvas id="canvas" width="1000px" height="600px"></canvas> 

JS script | jshint |wrap(script)

    _":generate data"

    _":put data in table"

    _":setup svg"

    _":counting the data"

    _":table the count"

    _":make axes"

    _":draw bars"

    _":print"

JS generate data

Let's generate 100 pieces of data from the range 0 to 20. We can use the good old [Math.random chestnut](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random#Example:_Using_Math.random)

   // Returns a random number between min and max
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }


    var i, n= 100, data = [];
    for (i=0; i < n; i+= 1) {
        data.push(getRandomArbitrary(0,20));
    }

    data.sort(d3.descending);

JS put data in table

We use d3 for this, of course. We need to organize it as a matrix. 

    var matrix = [], ii, nn = 10, row; 
    n = 10;
    for (i = 0; i < n; i += 1) {
        row = [];
        for (ii = 0; ii <nn; ii += 1) {
            row.push(data[i*10 + ii]);
        }   
        matrix.push(row);
    }

    d3.select("#data").selectAll("tr")
        .data(matrix).enter()
      .append("tr").selectAll("td")
        .data(Object).enter()
      .append("td")
        .text(d3.format('.2f'));

JS setup svg

    var width = 640;
    var height = 480;
    var root = d3.select("#chart").append("svg")
        .attr({
            width:width+100,
            height:height
        })
        .style({
            border: '1px solid black',
            background: 'white',
            'font-family' : 'Verdana, sans-serif',
        })
        .append("g")
          .style({
            border: '1px solid black',
            background: 'grey',
            'font-family' : 'Verdana, sans-serif',
        });

        

    var titleHeight = 50;
    root.append("text")
        .attr({
            'class' : 'title',
            'x' : width/2,
            'y' : titleHeight/2
        })
        .style({
            'fill': '#666',
            'font-family': 'Helvetica, sans-serif',
            'text-anchor': 'middle',
            'font-size': '24px'
        })
        .text("Random Data");


JS counting the data

First we need to create the bar counts. In this scratch work, we will use fixed intervals. 

    var max = 20, min = 0, step = 2; 



    var indices = d3.scale.linear()
        .domain([0, 1])
        .rangeRound([min+step/2, min+3*step/2]);


    var counts = d3.range(indices.invert(max+step/2))
        .map(function () {return 0;});


 
We use the d3 scale function to convert to the index and add it to the count total.

    data.forEach(function (v) {counts[Math.round(indices.invert(v))] += 1;});


JS table the count

We want to make a table with 

    var countsrows = d3.select("#counts").selectAll("tr")
        .data(counts).enter()
      .append("tr");

    countsrows
        .append("td")
            .text(function (d,i) {return indices(i);});
    
    countsrows
          .append("td")
            .text(function (d) {return d;});
    

JS draw bars

Now we can just largely mirror the table count, except making these into bars.    

We set the bar width. For non-continuous data, a value of 0.8 is probably good. Since this is continuous, we will use .8. 

    var barWidth = 1

To make the actual bars is fairly easy. We have the counts which is an array of the data heights. We use the `xScale` to determine the x-position using the index in the data set. The height uses the bar length. Since 

    root.selectAll('rect.bar')
        .data(counts).enter()
      .append('rect')
        .attr({
          'class': 'bar',
          'x': function(d, i) { return xScale(i + 0*(1-barWidth/2)); },
          'width': xScale(barWidth) - xScale(0),
          'y': function(d) { return yScale(d); }  ,
          'height': function(d) { return yScale(0) - yScale(d); }
        })
        .style({
            fill: "#fcc",
            stroke: "#444"
        });



JS make axes

We need to figure out the scales, tick marks, and draw the lines.

First we set a default height off-set for the x and y axis

    var xAxisHeight = 50;
    var yAxisWidth = 50;

To make the scales, we use the d3.scale.linear factory function. `xScale` maps the indices of the bins to pixel based coordinates while  `xScaleInd` maps the bin labels to pixel places. This I need to work through and uderstand better as this model is not good. The `yScale` maps a generous height level of the bars to the pixel counts. 

    var xScale = d3.scale.linear()
        .domain([0, counts.length])
        .range([yAxisWidth, width]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(counts) * 1.2])
        .range([height - xAxisHeight, titleHeight]);

    var xScaleInd = d3.scale.linear()
        .domain([min, max])
        .range([yAxisWidth, width]);


Once we have the scales, then we use the d3 axis function which does a bunch of stuff that I need to investigate with. But I think it creates a line, some ticks, and some labels. We put it in a group element and then transform (translate, maybe orient) the whole thing into place. 

    var xAxis = d3.svg.axis().scale(xScaleInd);
    root.append('g')
        .attr({
          'class': 'x axis',
          'transform': 'translate(0,' + (height - xAxisHeight) + ')'
        })
        .call(xAxis);

    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    root.append('g')
        .attr({
          'class': 'y axis',
          'transform': 'translate(' + yAxisWidth + ',0)'
        })
        .call(yAxis);


.JS print


    var xml = new XMLSerializer();
    var str = xml.serializeToString(root[0][0]);
    canvg(document.getElementById('canvas'), str);
    var img    = canvas.toDataURL("image/png");
    d3.select('body').append('img').attr('src', img);