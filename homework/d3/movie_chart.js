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
    $('.bar').css('display', 'block');
}

function bar() {
    data.forEach(function (d) {
        d.rotten_tomato = parseFloat(d.rotten_tomato);
        d.profit_world = parseFloat(d.profit_world)
    });

    var margin = { top: 20, right: 20, bottom: 70, left: 60 };
    var width = 600 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    function interval(score) {
        if (score < 10)
            return "0 - 9";
        else if (score < 20)
            return "10 - 19";
        else if (score < 30)
            return "20 - 29";
        else if (score < 40)
            return "30 - 39";
        else if (score < 50)
            return "40 - 49";
        else if (score < 60)
            return "50 - 59";
        else if (score < 70)
            return "60 - 69";
        else if (score < 80)
            return "70 - 79";
        else if (score < 90)
            return "80 - 89";
        else
            return "90 - 100"
    }

    function custonSort(a, b) {
        if (a.rotten_tomato === b.rotten_tomato) {
            return 0;
        }
        return  a.rotten_tomato > b.rotten_tomato ? 1 : -1;
    }

    var nodes = d3.nest()
        .key(function(d) { return interval(d.rotten_tomato); })
        .rollup(function(r) {
            return d3.mean(r, function(d) {
                return d.profit_world;
            })
        })
        .entries(data.sort(custonSort));

    var svg = d3.select("body").append("svg")
        .attr("class", "bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain(nodes.map(function(d) { return d.key; }));
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
        .attr("y", height * 1.23)
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
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.values); })
        .attr("height", function (d) { return height - y(d.values); });

    var txt = d3.select("body").append("div")
        .attr("class", "bar");
    $("div").css("width", width + margin.left + margin.right);
    txt.append("text")
        .text("영화의 로튼 토마토 점수와 세계에서 벌어들인 수익 간의 관계를 알아보기 위한 바 차트이다. " +
            "로튼 토마토 점수대가 같은 영화들의 수익을 평균 내었다. 로튼 토마토 점수가 아주 높거나 낮지 않은 이상, " +
            "평균 수익은 거의 비슷하였다. 로튼 토마토 점수와 영화의 수익은 유의미한 상관관계가 없다고 " +
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

    var color = d3.scale.ordinal()
        .domain(['드라마', '액션', '스릴러', '코미디', '호러', '어드벤처'])
        .range(['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#ff9896']);

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
        .attr("fill", function(d) { return color(d.genre); })
        .attr('r', 3.5)
        .attr("cx", function (d) { return x(d.cost); })
        .attr("cy", function (d) { return y(d.profit_world); });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
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
        .style("fill", function(d) { return color(d); });

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
            "제작 비용이 많이든 영화는 대부분 어드벤처 영화와 액션 영화였고, " +
            "최고 고수익을 낸 영화는 어드벤처 영화였다.")
}