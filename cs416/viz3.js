d3.csv(police_locals_csv_link, function(data) {
    create_slide3(data);
});

function create_slide3(data) {
  let b_data = [];

  let select = d3.select('#cities');

  data.forEach(d => {
    select.append('option').attr('value', d['city']).text(d['city']);

    let b = {};
    b['city'] = d['city'];
    b['race'] = 'White';
    b['count'] = (d['white'] !== '**') ? parseFloat(d['white']) : 0;
    b_data.push(b);
    b = {};
    b['city'] = d['city'];
    b['race'] = 'Non-White';
    b['count'] = (d['non-white'] !== '**') ? parseFloat(d['non-white']) : 0;
    b_data.push(b);
    b = {};
    b['city'] = d['city'];
    b['race'] = 'Black';
    b['count'] = (d['black'] !== '**') ? parseFloat(d['black']) : 0;
    b_data.push(b);
    b = {};
    b['city'] = d['city'];
    b['race'] = 'Hispanic';
    b['count'] = (d['hispanic'] !== '**') ? parseFloat(d['hispanic']) : 0;
    b_data.push(b);
    b = {};
    b['city'] = d['city'];
    b['race'] = 'Asian';
    b['count'] = (d['asian'] !== '**') ? parseFloat(d['asian']) : 0;
    b_data.push(b);
  });

  let svg = d3.select("#bar")
              .append("svg")
              .attr("viewBox", [0, 0, b_width, b_height]);

  let x = d3.scaleBand()
              .domain(b_data.map(d => d['race']))
              .range([b_margin.left, b_width - b_margin.right])
              .padding(0.5);

  let y = d3.scaleLinear()
              .domain([0, d3.max(b_data, d => d['count'])]).nice()
              .range([b_height - b_margin.bottom, b_margin.top])

  svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (b_height - b_margin.bottom) + ")")
            .call(d3.axisBottom(x))
            .attr('font-size', 8);

  svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + b_margin.left + ",0)")
            .call(d3.axisLeft(y).ticks(10, "%"))
            .attr('font-size', 8)
            .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end");

  let f_data = b_data.filter(d => {
      let sq = d3.select("#cities").property("value");
      return d['city'] === sq;
    });

  // let xs = { 'White': 107, 'Non-White': 183, 'Black': 260, 'Hispanic': 336, 'Asian': 412};
  let perXScale = (b_width - b_margin.left - b_margin.right) / 5;
  let xs = {
      'White': perXScale,
      'Non-White': perXScale*2,
      'Black': perXScale*3,
      'Hispanic': perXScale*4,
      'Asian': perXScale*5
  };
  let xs2 = {
      'White': 'M 93 40L 93 100',
      'Non-White': 'M 107 40L 107 100',
      'Black': 'M 210 40L 210 100',
      'Hispanic': 'M 270 40L 270 100',
      'Asian': 'M 307 40L 307 100',
  };
  let path = svg.append('path')
                .attr('d', 'M 107 40L 107 370')
                .style('fill', 'none')
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .style('visibility', 'hidden');

  let text = svg.append('text')
              .attr('x', 80)
              .attr('y', 35)
              .attr('font-size', '9px')
              .style('visibility', 'hidden');

  svg.selectAll("rect")
        .data(f_data)
        .enter().append("rect")
        .attr("x", d => x(d['race']))
        .attr("width", x.bandwidth())
        .attr("fill", color_green)
        .on("mouseover", d => {
            let c = d['city'].split(',')[0];
            let note = 'Among the ' + d['race'] + ' cops in ' + c + ' PD, ' +
                       d3.format(".0%")(d['count']) + ' are living in the city';
            if (d['count'] == 0) {
              note = 'Data Not Available';
            }
            div.transition()
               .duration(200)
               .style("opacity", .9);
            div.html(note)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            div.transition()
               .duration(500)
               .style("opacity", 0);
        });
        // .on("mouseover", d => {
        //   let xpos = xs[d['race']];
          // let c = d['city'].split(',')[0];
          // let note = 'Among the ' + d['race'] + ' cops in ' + c + ' PD, ' +
          //            d3.format(".0%")(d['count']) + ' are living in the city';
          // if (d['count'] == 0) {
          //   note = 'Data Not Available';
          // }
        //   path.attr('d', xs2[d['race']])
        //       .style('visibility', 'visible');
        //   // path.attr('d', 'M ' + xpos + ' 40L ' + xpos + ' 100')
        //   //     .style('visibility', 'visible');
        //   text.text(note);
        //   let len = text.node().getComputedTextLength();
        //   if (xpos + len >= b_width) {
        //     text.attr('x', b_width - len - 20);
        //   } else {
        //     text.attr('x', xpos - 30);
        //   }
        //   text.style('visibility', 'visible');
        // })
        // .on("mouseout", d => {
        //   path.style('visibility', 'hidden');
        //   text.style('visibility', 'hidden');
        // });

  svg.selectAll("rect")
       .attr("y", b_height - b_margin.bottom)
       .attr("height", 0)
       .transition().duration(500)
       .delay((d, i) => i * 10)
       .attr("y", d => y(d['count']))
       .attr("height", d => b_height - b_margin.bottom - y(d['count']));

  d3.select("#cities").on("change", () => {
       let sq = d3.select("#cities").property("value");
       let data = b_data.filter(d => d['city'] === sq)

       svg.selectAll("rect")
         .data(data)
         .transition().duration(500)
         .delay((d, i) => i * 10)
         .attr("x", d => x(d['race']))
         .attr("y", d => y(d['count']))
         .attr("height", d => b_height - b_margin.bottom - y(d['count']));
   });
}
