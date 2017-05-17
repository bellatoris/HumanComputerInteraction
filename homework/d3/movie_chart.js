function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(init);

function init() {
    $("button").click(function () {
        var chart = '.' + $(this).text();
        $('svg').css('display', 'none');
        $('div').css('display', 'none');
        $(chart).css('display', 'block');
    });

    bar();
    scatter();
    $('svg').css('display', 'none');
    $('div').css('display', 'none');
}

function bar() {
    data.forEach(function (d) {
        d.rotten_tomato = parseFloat(d.rotten_tomato);
        d.profit_world = parseFloat(d.profit_world)
    });

    var margin = { top: 20, right: 20, bottom: 70, left: 60 };
    var width = 600 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(20);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var nodes = d3.nest()
        .key(function(d) { return d.rotten_tomato; })
        .rollup(function(r) {
            return d3.mean(r, function(d) {
                return d.profit_world;
            })
        })
        .entries(data);

    var svg = d3.select("body").append("svg")
        .attr("class", "bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, 100]);
    y.domain([0, d3.max(nodes, function (d) { return d.values; })]);

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Profit from world vs Rotten tomato score");

    svg.append("text")
        .style("font-size", "10px")
        .attr("x", (width / 2))
        .attr("y", height * 1.2)
        .attr("text-anchor", "middle")
        .text("Rotten tomato score");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)")

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Profit from world");

    svg.selectAll("bar")
        .data(nodes)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function (d) { return x(d.key); })
        .attr("width", 2)
        .attr("y", function (d) { return y(d.values); })
        .attr("height", function (d) { return height - y(d.values); });

    var txt = d3.select("body").append("div")
        .attr("class", "bar");
    $("div").css("width", width + margin.left + margin.right);
    txt.append("text")
        .text("영화의 로튼 토마토 점수와 세계에서 벌어들인 수익 간의 관계를 알아보기 위한 바 차트이다. " +
            "로튼 토마토 점수가 같은 영화들의 수익은 평균을 내었다. 로튼 토마토 점수가 높은 영화도 수익이 낮은 경우가 많고, " +
            "로튼 토마토 점수가 낮은 영화도 수익이 높은 경우가 많았다. 로튼 토마토 점수와 영화의 수익은 유의미한 상관관계가 없다고 " +
            "결론을 내렸다.")
}

function scatter() {
    data.forEach(function (d) {
        d.cost = parseFloat(d.cost);
        d.profit_world = parseFloat(d.profit_world)
    });

    var margin = { top: 20, right: 20, bottom: 70, left: 60 };
    var width = 600 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(20);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("body").append("svg")
        .attr("class", "scatter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, d3.max(data, function(d) { return d.cost; })]);
    y.domain([0, d3.max(data, function (d) { return d.profit_world; })]);

    var color_index = d3.scale.ordinal()
        .domain(['드라마', '액션', '스릴러', '코미디', '호러', '어드벤처'])
        .range(['0', '1', '2', '3', '4', '5']);

    var color = d3.scale.category20();

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Profit from world vs Cost");

    svg.append("text")
        .style("font-size", "10px")
        .attr("x", (width / 2))
        .attr("y", height * 1.1)
        .attr("text-anchor", "middle")
        .text("Cost");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Profit from world");

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("fill", function(d) { return color(color_index(d.genre)); })
        .attr('r', 3.5)
        .attr("cx", function (d) { return x(d.cost); })
        .attr("cy", function (d) { return y(d.profit_world); });

    var legend = svg.selectAll(".legend")
        .data(color_index.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored circle
    legend.append("circle")
        .attr('r', 3.5)
        .attr("cx", width - 4)
        .attr('cy', 9)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(color_index(d)); });

    // draw legend text
    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

    var txt = d3.select("body").append("div")
        .attr("class", "scatter");
    $("div").css("width", width + margin.left + margin.right);
    txt.append("text")
        .text("영화의 제작 비용과 세계에서 벌어들인 수익 간의 관계를 알아보기 위한 산점도이다. " +
            "로튼 토마토 점수와는 달리 제작 비용과 수익은 어느 정도 비례하는 관계를 보여주었다. " +
            "장르로 컬러링을 한 결과, 드라마와 호러 영화는 상대적으로 제작 비용도 적고 수익도 적었다. " +
            "제작 비용이 많이든 영화는 대부분 어드벤처 영화와 액션 영화이었고, " +
            "고수익을 낸 영화도 대부분 어드벤처 영화와 액션 영화였다.")
}