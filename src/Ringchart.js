/**
 * Created by Dragon on 2017-06-14.
 */
var svg = dimple.newSvg("#chartContainer", 590, 400);

d3.tsv("data/2015_total_air_data_Si-do.tsv", function (data) {
    var myChart = new dimple.chart(svg, data);

    myChart.setBounds(20, 20, 460, 360)
    myChart.addMeasureAxis("p", "Total");

    var ring = myChart.addSeries("Si-do", dimple.plot.pie);

    ring.innerRadius = "50%";
    myChart.addLegend(500, 20, 90, 300, "left");
    myChart.draw();
});