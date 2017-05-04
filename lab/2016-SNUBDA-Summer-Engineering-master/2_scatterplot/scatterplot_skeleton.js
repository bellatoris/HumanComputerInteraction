function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(init);

function init() {
  data.forEach(function(d) {
    d.length = parseFloat(d.length);
    d.width = parseFloat(d.width);
  });

  var svg = d3.select('svg');

  var width = 500, height = 500;
  var margin = {left: 50};
  var x = d3.scale.linear()
                  .domain([
                    d3.min(data, function(d){return d.width;}),
                    d3.max(data, function(d){return d.width;})
                  ])
                  .range([0, width]);
  var y = d3.scale.linear()
                  .domain([
                    d3.min(data, function(d){return d.length;}),
                    d3.max(data, function(d){return d.length;})
                  ])
                  .range([height, 0]);

  var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

  var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');
  
  // 여기서부터 코드 작성을 시작하세요.  
  d3.tsv('../data/iris.tsv', function(error, data) {
    data.forEach(function(d) {
      d.length = parseFloat(d.length);
      d.width = parseFloat(d.width);
    });
    var svg = d3.select('svg');
    svg
      .selectAll('circle')
      .data(data)
      .enter()
        .append('circle')
        .attr('r', 3.5)
        .attr('cx', function(d) {
          return x(d.width);
        })
        .attr('cy', function(d) {
          return y(d.length);
        })

    svg
      .appned('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis)
  });
}
