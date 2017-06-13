/**
 * Created by sille on 2017-06-13.
 */
(function() {
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.PM10); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/Hightest_seoul_pm10_2016.csv", function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

        data.forEach(function(d) {
            d.date = parseDate(d.date);
        });

        var cities = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {date: d.date, PM10: +d[name]};
                })
            };
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));

        y.domain([
            d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.PM10; }); }),
            d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.PM10; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("PM10 (㎛)");

        var city = svg.selectAll(".city")
            .data(cities)
            .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .attr("data-legend",function(d) { return d.name})
            .style("stroke", function(d) { return color(d.name); });

//        city.append("text")
//            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.PM10) + ")"; })
//            .attr("x", 3)
//            .attr("dy", ".25em")
//            .text(function(d) { return d.name; });


        legend = svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(950,10)")
            .style("font-size","12px")
            .call(d3.legend)

        setTimeout(function() {
            legend
                .style("font-size","10px")
                .attr("data-style-padding",10)
                .call(d3.legend)
        },1000)

    })

    d3.legend = function(g) {
        g.each(function() {
            var g= d3.select(this),
                items = {},
                svg = d3.select(g.property("nearestViewportElement")),
                legendPadding = g.attr("data-style-padding") || 5,
                lb = g.selectAll(".legend-box").data([true]),
                li = g.selectAll(".legend-items").data([true])

            lb.enter().append("rect").classed("legend-box",true)
            li.enter().append("g").classed("legend-items",true)

            svg.selectAll("[data-legend]").each(function() {
                var self = d3.select(this)
                items[self.attr("data-legend")] = {
                    pos : self.attr("data-legend-pos") || this.getBBox().y,
                    color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
                }
            })

            items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})


            li.selectAll("text")
                .data(items,function(d) { return d.key})
                .call(function(d) { d.enter().append("text")})
                .call(function(d) { d.exit().remove()})
                .attr("y",function(d,i) { return i+"em"})
                .attr("x","1em")
                .text(function(d) { ;return d.key})

            li.selectAll("circle")
                .data(items,function(d) { return d.key})
                .call(function(d) { d.enter().append("circle")})
                .call(function(d) { d.exit().remove()})
                .attr("cy",function(d,i) { return i-0.25+"em"})
                .attr("cx",0)
                .attr("r","0.4em")
                .style("fill",function(d) { console.log(d.value.color);return d.value.color})

            // Reposition and resize the box
            var lbbox = li[0][0].getBBox()
            lb.attr("x",(lbbox.x-legendPadding))
                .attr("y",(lbbox.y-legendPadding))
                .attr("height",(lbbox.height+2*legendPadding))
                .attr("width",(lbbox.width+2*legendPadding))
        })
        return g
    }
})()
