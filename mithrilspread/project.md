# Mithril Spreadsheet

This is a updated copy exploration of [mithril spreadsheet](
http://lhorie.github.io/mithril-blog/a-spreadsheet-in-60-lines-of-javascript.html
) That article seems to use an older version of mithril so this is an attempt
to explore and update it. This is my first experience with mithril. 


## The Model Layer

We'll use the variable data to be our in-memory store. It gets reloaded from
the local storage or created freshly as needed. 

    var data = JSON.parse(localStorage["spreadsheet"] || {});

Spreadsheets have explicit values and computable values. The computable values
require a bit of work so we put that in its own section.

    _"computable"

Now we can run through the loaded cells and convert them into computables as
needed.

    var cell;
    for (cell in data) {
        data[cell] = computable(value);
    }

It will use an update function to handle what happens when a cell is edited.
The computable issues is handled by the computable function. 

    var update = function (cell, value) {
        data[cell] = computable(value);
        localStorage["spreadsheet"] = JSON.stringify(data);
    };

### Computable

The key idea here is to create a String object and put in a custom `valueOf`
method that will do the computing. The `+value` does an implicit number
conversion. If it is a number, then that is what is used.  


    var computable = function (value) {
        if (isNan(+value) {
            var output = new String(value);
            output.valueOf = _"compute";
            return output;
        } else {
            return +value;
        }
    };

#### Compute

This does the actual computation. Its uses closures to grab the data and value
variables. By using `with`, it automatically imports the keys of data as
variables in the environment, saving a lot of look ups.  

    function compute () {
        if (value !== null && value[0] === "=") {
            try { 
                with (data) {
                    return eval(value.substring(1));
                }
            } catch (e) {
                console.log(e);
                return NaN;
            }
        } else {
            return value;
        }


## The View Layer 1


We create a grid function that creates the spreadsheet grid. It is a fairly
simple setup of letters and numbers going along and those are the loop
boundaries. The core is what is happening in the "td" element. If `i` or `j`
are 0, then those are label cells. Otherwise, we create an actual cell.  


    const grid = function (withCell) {
        for (let rows = [], i = 0; i < 27; i++) {
            for (let cols = [], j = 0; j < 17; j++) {
                const letter = String.fromCharCode("a".charCodeAt(0) + j - 1);
                cols.push(m("td", i && j ? withCell(letter + i) : i || letter));
            }
            rows.push(m("tr", cols));
        }
        return m("table", m("tbody", rows));
    }


    const view ()  {
        return grid(function(cellName) {
            return m("input", {
                onchange: m.withAttr("value", update.bind(this, cellName)),
                value: data[cellName] || ""
            });
        });
    }



## View 2




## CSS

    html,body {margin:0;padding:0;}
    table {border-collapse:collapse;}
    tr:first-child td,td:first-child {background:#ddd;}
    td {border:1px solid #888;padding:0;text-align:center;}
    td input {border:0;display:block;height:20px;padding:1px;width:80px;}
    a {border:1px solid #888;border-top:0;display:inline-block;margin:3px;padding:0 3px;text-decoration:none;}
    .formula {margin:3px;width:1337px;}

## HTML

Here is the body of the HTML

## Reference

This is the hosted version. 

    <!doctype html>
    <title>Spreadsheet</title>
    <style type="text/css">
    html,body {margin:0;padding:0;}
    table {border-collapse:collapse;}
    tr:first-child td,td:first-child {background:#ddd;}
    td {border:1px solid #888;padding:0;text-align:center;}
    td input {border:0;display:block;height:20px;padding:1px;width:80px;}
    a {border:1px solid #888;border-top:0;display:inline-block;margin:3px;padding:0 3px;text-decoration:none;}
    .formula {margin:3px;width:1337px;}
    </style>
    <body></body>
    <script src="//unpkg.com/mithril/mithril.js"></script>
    <script src="//unpkg.com/mithril-stream"></script>
    <script type="text/javascript">
    var data = JSON.parse(localStorage["spreadsheet"] || "{}")
    for (var cell in data) data[cell] = computable(data[cell])

    function computable(value) {
        var output = new String(value)
        output.valueOf = compute.bind(this, value)
        return isNaN(+value) ? output : +value
    }
    function compute(value) {
        if (value != null && value[0] == "=") {
            try { with (data) return eval(value.substring(1)) } catch (e) {}
        }
        else return value
    }
    function update(cell, value) {
        data[cell] = computable(value)
        localStorage["spreadsheet"] = JSON.stringify(data)
    }
    var cell;
    function grid(withCell) {
        for (var rows = [], i = 0; i < 27; i++) {
            for (var cols = [], j = 0; j < 17; j++) {
                var letter = String.fromCharCode("a".charCodeAt(0) + j - 1)
                cols.push(m("td", i && j ? withCell(letter + i) : i || letter))
            }
            rows.push(m("tr", cols))
        }
        return m("table", m("tbody", rows))
    }
    function view() {
        return [
            m("input.formula", {
                onchange: m.withAttr("value", update.bind(this, cell())),
                value: data[cell()] || ""
            }),
            grid(function(cellName) {
                var value = compute(data[cellName]) || ""
                if (value) console.log(123,value)
                return m("input", {
                    onkeydown: move,
                    onfocus: cell.bind(this, cellName),
                    onchange: m.withAttr("value", update.bind(this, cellName)),
                    value: value,
                    style: {textAlign: isNaN(value) || value === "" ? "left" : "right"}
                })
            })
        ]
    }
    function move(e) {
        var td = e.target.parentNode, tr = td.parentNode, table = tr.parentNode
        if (e.keyCode == 37) return highlight(tr.childNodes[Math.max(1, td.cellIndex - 1)].firstChild)
        else if (e.keyCode == 38) return highlight(table.childNodes[Math.max(1, tr.rowIndex - 1)].childNodes[td.cellIndex].firstChild)
        else if (e.keyCode == 39) return highlight(tr.childNodes[Math.min(tr.childNodes.length - 1, td.cellIndex + 1)].firstChild)
        else if (e.keyCode == 40) return highlight(table.childNodes[Math.min(table.childNodes.length - 1, tr.rowIndex + 1)].childNodes[td.cellIndex].firstChild)
        else m.redraw.strategy("none")
    }
    function highlight(cell) {
        cell.focus()
        cell.selectionEnd = cell.value.length
        //return false
    }
    m.render(document.body, view );
    </script>

[ref.html](# "save:")


## Hello World

First attempts



    <!doctype html>
    <title>Hello World</title>
    <body>
        <script src="//unpkg.com/mithril/mithril.js"></script>
        <script>
        var root = document.body;
        var m = window.m;


        m.render(root, m("main", [
            m("h1", {class:"title"}, "Hello world"),
            m("button", "A button")
            ]) 
        );



        </script>
    </body>


[hw.html](# "save:")


## Hello Component

Components

    <!doctype html>
    <title>Hello World</title>
    <body>
        <script src="//unpkg.com/mithril/mithril.js"></script>
        <script>
            _":script"

        </script>
    </body>


[hc.html](# "save:")

[script]() 

    var root = document.body;
    var m = window.m;
 
 `_":their version"`


    m.mount(root, _":hello | ife" );

[their version]()

    var count = 0 // added a variable

    var Hello = {
        view: function() {
            return m("main", [
                m("h1", {class: "title"}, "My first app"),
                // changed the next line
                m("button", {onclick: function() {count++}}, count + " clicks"),
            ])
        }
    }

    m.mount(root, Hello)


[hello]()

Here we define the hello element. 
   
    let count = 0;
    const click = function () {count += 1;};
    return {
        view: function () {
            return m("main", [
                m("h1", {class:"title"}, "Hello world"),
                m("button", {
                    onclick: click
                    }, count + " clicks")
            ]); 
         }
    };

    
    

## Hello Routing

Routing

    <!doctype html>
    <title>Hello World-Routing</title>
    <body>
        <script src="//unpkg.com/mithril/mithril.js"></script>
        <script>
            _":script"

        </script>
    </body>


[hr.html](# "save:")


[script]()

    var root = document.body;
    var m = window.m;
    m.route(root, "/splash", {
        "/splash" : _":splash",
        "/hello" : _":hello | ife"
    });


[splash]()

Initial page

    {   
        view: function() {
            return m("a", {href: "#!/hello"}, "Enter!")
        }
    }


[hello]()

Here we define the hello element. 
   
    let count = 0;
    const click = function () {count += 1;};
    return {
        view: function () {
            return m("main", [
                m("h1", {class:"title"}, "Hello world"),
                m("button", {
                    onclick: click
                    }, count + " clicks")
            ]); 
         }
    };

    
## Hello XHR
Routing

    <!doctype html>
    <title>Hello World-Routing</title>
    <body>
        <script src="//unpkg.com/mithril/mithril.js"></script>
        <script>
            _":script"

        </script>
    </body>


[hx.html](# "save:")


[script]()

    var root = document.body;
    var m = window.m;
    m.route(root, "/splash", {
        "/splash" : _":splash",
        "/hello" : _":hello | ife"
    });


[splash]()

Initial page

    {   
        view: function() {
            return m("a", {href: "#!/hello"}, "Enter!")
        }
    }


[hello]()

Here we define the hello element. 
   
    let count = 0;
    const click = _":xhr";
    return {
        view: function () {
            return m("main", [
                m("h1", {class:"title"}, "Hello world"),
                m("button", {
                    onclick: click
                    }, count + " clicks")
            ]); 
         }
    };

[xhr]()

This contacts the REM API stub

    function() {
        m.request({
            method: "PUT",
            url: "//rem-rest-api.herokuapp.com/api/tutorial/1",
            data: {count: count + 1},
            withCredentials: true,
        })
        .then(function(data) {
            count = parseInt(data.count)
        })
    } 


