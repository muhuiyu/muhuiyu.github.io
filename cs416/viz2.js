d3.csv(police_locals_csv_link, function(data) {
    create_slide2(data);
});

function create_slide2(data) {
    let keys = ["Locals", "Non-Locals"];
    let colors = [color_green, color_red];

    let b_data = [];

    data.forEach(d => {
        let b = {};
        b['city'] = d['city'];
        b['total'] = parseInt(d['police_force_size']);
        b['Locals'] = Math.round(b['total'] * d['all']);
        b['Non-Locals'] = b['total'] - b['Locals'];
        b_data.push(b);
    });

  b_data.sort((a, b) => b['total'] - a['total']);

  let svg = d3.select("#stack-bar")
              .append("svg")
              .attr("viewBox", [0, 0, sb_width, sb_height]);

  let x = d3.scaleLinear()
            .domain([0, d3.max(b_data, d => d['total'])]).nice()
            .range([margin.left, sb_width - margin.right]);

  let y = d3.scaleBand()
            .domain(b_data.map(d => d['city']))
            .range([margin.top, sb_height - margin.bottom])
            .padding(0.08);

  let z = d3.scaleOrdinal()
            .domain(keys)
            .range(colors);

  svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + margin.top + ")")
        .style("font-size", "12")
        .call(d3.axisTop(x).ticks(sb_width / 100, "s"))
        .call(g => g.selectAll(".domain").remove());

  svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .style("font-size", "12")
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove());

  svg.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(b_data))
      .enter()
      .append("g")
      .attr("fill", d => z(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d.data['city']))
      .attr("height", y.bandwidth())
      .on("mouseover", d => {
          let text = 'City: ' + d.data['city'] + '<br/># of Locals: ' + f(d.data['Locals']) +
                     '<br/># of Non-Locals: ' + f(d.data['Non-Locals']);
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

  svg.selectAll('rect')
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr("width", d => x(d[1]) - x(d[0]));

  add_annotation(svg, 'M 390 138L 510 210', [520,215],
                 'More than 80% of the cops in Chicago and Philadelphia are living in the city');
  add_annotation(svg, 'M 330 168L 450 280', [460,295],
                 'Since Los Angeles doesn’t require police to live in the city, only 23% live in the city');
  add_annotation(svg, 'M 250 245L 510 210', [], '');
  add_annotation(svg, 'M 175 1165L 300 1165', [310,1170],
                   '93% of the cops in Laredo PD are living in the city which is the highest among all the cities in the list');
  add_annotation(svg, 'M 175 795L 300 795', [310,798],
                    'only 7% of officers in Miami live within city limits');
add_annotation(svg, 'M 175 535L 300 535', [310,540],
                  'Jacksonville, Florida, has more than 80 percent of its police officers living within the city limits. That may reflect its sprawling boundaries; the city proper has an unusually high share of the metro area’s population.');
add_annotation(svg, 'M 175 430L 300 430', [310,433],
                  'the city of Atlanta, which is small compared with metro Atlanta’s population, has just 14% of its police force living in town');
  add_annotation(svg, 'M 165 1610L 310 1610', [320,1615],
                   'Most of the cops in Richmond and Minneapolis PD are living out of the city');

  let legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(100," + (5 + i * 25) + ")");

  legend.append("rect")
    .attr("x", 150)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d, i) => colors.slice()[i]);

  legend.append("text")
    .attr("x", 175)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text((d, i) => {
      switch (i) {
        case 0: return "Locals: Officers live in the city they serve";
        case 1: return "Non-Locals: Officers don't live in the city they serve";
      }
    });
}
