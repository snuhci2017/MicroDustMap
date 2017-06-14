/**
 * Created by sille on 2017-06-02.
 */
var width = 960,
    height = 600,
    active = d3.select(null);

var datasets = ["data/16_Jan_seoul.csv", "data/16_Feb_seoul.csv", "data/16_Mar_seoul.csv", "data/16_Apr_seoul.csv",
    "data/16_May_seoul.csv", "data/16_Jun_seoul.csv", "data/16_Jul_seoul.csv", "data/16_Aug_seoul.csv",
    "data/16_Sep_seoul.csv", "data/16_Oct_seoul.csv", "data/16_Nov_seoul.csv", "data/16_Dec_seoul.csv"];

var projection = d3.geo.mercator()
    .center([128.938, 36.2455])
    .scale(4500)
    .translate([width/2, height/2]);

var path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

g.append("rect")
    .attr("class", "background")
    .attr("id", "map")
    .attr("width", width)
    .attr("height", height);

d3.json("map/skorea_municipalities_topo_simple.json", function(error, data) {
    if(error) throw error;

    var features = topojson.feature(data, data.objects.skorea_municipalities_geo).features;

     g.append("g")
        .attr("class", "municipalities")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
         .on("click", clicked)
         .on("mouseenter", cursorEnter)
         .on("mouseleave", cursorLeave);

        g.append("path")
            .datum(topojson.feature(data, data.objects.skorea_municipalities_geo, function (a, b) {
                return a !== b
            }))
            .attr("class", "mesh")
            .attr("d", path);

    // 각 시,도,군 별 지도위 이름 표시
//       g.append("g")
//           .selectAll("text")
//           .data(features)
//           .enter().append("text")
//           .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
//           .attr("d", path)
//           .attr("class", "feature")
//           .on("click", clicked)
//           .attr("dy", ".35em")
//           .attr("class", "municipality-label")
//           .text(function(d) { return d.properties.name; })
});

function cursorEnter(d) {
    var x, y;
    var centroid = path.centroid(d);
    var text = d.properties.name;

    x = centroid[0];
    y = centroid[1];

    g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", ".35em")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("class", "cursor_enter")
        .text(text);
}

function cursorLeave(d) {
    $(".cursor_enter").remove();
}

// 맵 클릭시 줌인
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

// 줌인된 맵 재 클릭시 줌 아웃
function reset() {
    active.classed("active", false);
    active = d3.select(null);

    g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
}