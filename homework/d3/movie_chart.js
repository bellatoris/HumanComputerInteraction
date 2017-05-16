function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(init);

function init() {
    var svg = d3.select('svg');
    data.forEach(function (d) {
        d.rotten_tomato = parseFloat(rotten_tomato);

    });

    svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', function (d, i) {
            return d.value * 10;
        })
        .attr('height', 20)
        .style('fill', 'steelblue')
        .attr('transform', function (d, i) {
            return 'translate(0,' + i * 30 + ')';
        });

}
