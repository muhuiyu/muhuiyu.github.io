d3.csv(police_locals_csv_link, function(data) {
    create_map(data);
});

function create_map(data) {
    d3.json(us_states_json_link, function(json) {

        let projection = d3.geoAlbersUsa()
                       .translate([map_width/2, map_height/2])
                       .scale(1200);

        let path = d3.geoPath()
                     .projection(projection);

        let svg = d3.select("#map")
                .append("svg")
                .attr("width", map_width)
                .attr("height", map_height)
                .attr("viewBox", "0 0 " + map_width + " " + map_height)
                .attr("preserveAspectRatio", "xMidYMid meet");

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", color_dark_gray)
            .style("stroke-width", "1")
            .style("fill", color_gray);

        d3.csv(us_city_lat_long_csv_link, function(city) {
            data.forEach(d => {
                city.forEach(c => {
                    if (d['city'] === c['city']) {
                      d['lat'] = c['lat'];
                      d['long'] = c['long'];
                    }
                });
            });

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => projection([d['long'], d['lat']])[0])
                .attr("cy", d => projection([d['long'], d['lat']])[1])
                .attr("r", d => d['police_force_size'] / 500)
                .style("fill", color_red)
                .style("stroke", color_dark_red)
                .style("stroke-width", "1")
                .on("mouseover", d => {
                    let text = 'City: ' + d['city'] + '<br/># of Officers: ' + f(d['police_force_size']);
                    div.transition()
                       .duration(200)
                       .style("opacity", .9);
                    div.html(text)
                       .style("left", (d3.event.pageX) + "px")
                       .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", d => {
                    div.transition()
                       .duration(500)
                       .style("opacity", 0);
                });

            animate_circle(svg);
            add_annotation(svg, 'M 910 170L 820 75', [650, 70], 'New York City has the largest police force in the country');
            add_annotation(svg, 'M 910 170L 820 75', [0, 430], 'New York City has the largest police force in the country');
        });
    });
}
