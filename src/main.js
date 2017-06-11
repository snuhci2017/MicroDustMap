/**
 * Created by sille on 2017-06-02.
 */
//    d3.csv("place.csv", function(data) {
    //        places.selectAll("circle")
    //            .data(data)
    //            .enter().append("circle")
    //            .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
    //            .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
    //            .attr("r", 10);

    //        places.selectAll("text")
    //            .data(data)
    //            .enter().append("text")
    //            .attr("x", function(d) { return projection([d.lon, d.lat])[0]; })
    //            .attr("y", function(d) { return projection([d.lon, d.lat])[1] + 8; })
    //            .text(function(d) { return d.name });
    //    });

var width = 960,
    height = 600,
    active = d3.select(null);

var projection = d3.geo.mercator()
    .center([128.938, 36.2455])
    .scale(4500)
    .translate([width/2, height/2]);

var path = d3.geo.path().projection(projection);

<!--"body" to "#chart" -->
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

g.append("rect")
    .attr("class", "background")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height);

var places = svg.append("g").attr("id", "places");

d3.json("map/skorea_municipalities_topo_simple.json", function(error, data) {
    if(error) throw error;

    var features = topojson.feature(data, data.objects.skorea_municipalities_geo).features;

    // focus on cursor
    g.append("g")
        .attr("class", "municipalities")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("class", function(d) { console.log(); return "municipality c" + d.properties.code })
        .attr("d", path)
        .attr("class", "feature")
        .on("click", clicked)
        .append("title")
        .text(function(d) { return d.properties.name; });

    g.append("path")
        .datum(topojson.feature(data, data.objects.skorea_municipalities_geo, function (a, b) { return a !== b }))
        .attr("class", "mesh")
        .attr("d", path);

    //   g.append("g")
    //       .selectAll("text")
    //      .data(features)
    //     .enter().append("text")
    //    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    //   .attr("d", path)
    //  .attr("class", "feature")
    // .on("click", clicked)
    //.attr("dy", ".35em")
    //.attr("class", "municipality-label")
    //.text(function(d) { return d.properties.name; })
});

function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");


}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
}

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function() {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

