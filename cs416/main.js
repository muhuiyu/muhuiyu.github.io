// data links
let base_link = "https://raw.githubusercontent.com/muhuiyu/cs416-dataviz-data/main/"
let police_locals_csv_link = base_link + "police-locals.csv";
let us_city_lat_long_csv_link = base_link + "us-city-lat-long.csv";
let us_states_json_link = base_link + "us-states.json";

// color
let color_red = "#d25c4d";
let color_green = "#10a778";
let color_dark_red = "#ff0000";
let color_gray = "#e5e5e5";
let color_dark_gray = "#888";

// Map Width and Height
let map_width = 1200;
let map_height = 600;

// Stacked Bar Chart Width, Height and Margin
let sb_width = 1000;
let sb_height = 2100;
let margin = {top: 100, right: 30, bottom: 30, left: 150};

// Bar Chart Width, Height and Margin
let b_width = 400;
let b_height = 300;
let b_margin = {top: 50, right: 30, bottom: 30, left: 50};

let f = d3.format(",");

let div = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

function add_annotation(svg, l_coord, t_coord, note) {
    let path = svg.append('path')
                  .attr('d', l_coord)
                  .style('fill', 'none')
                  .style('stroke', 'black')
                  .style('stroke-width', 1);

    animate_path(path);

    let text = null;
    if (t_coord.length > 0) {
        text = svg.append('text')
                .attr('x', t_coord[0])
                .attr('y', t_coord[1])
                .attr('font-size', 13)
                .text(note);
        animate_text(text);
    }

    return text;
}

function animate_circle(svg) {
    svg.selectAll("circle")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .style("opacity", 0.85);
}

function animate_path(path) {
    var totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(500)
        .delay(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}

function animate_text(text) {
    text.style("opacity", 0)
        .transition()
        .duration(500)
        .delay(1200)
        .style("opacity", 1);
}
