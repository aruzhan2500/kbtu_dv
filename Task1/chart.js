async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessorMin = (d) => d.temperatureMin; //lowest temperature
    const yAccessorMax = (d) => d.temperatureHigh; //highest temperature

    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yLowScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessorMin))
        .range([dimension.boundedHeight, 50]);

    const yHighScaler = d3.scaleLinear() // scaler for high temperature
        .domain(d3.extent(data,yAccessorMax))
        .range([dimension.boundedHeight, 50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var x_axis = d3.axisBottom() // bottom horizontal axis
        .scale(xScaler);

    var y_axis = d3.axisLeft() // left vertical axis
        .scale(yLowScaler);

    bounded.append("g")
        .attr("transform", "translate(100, 10)")
        .call(y_axis);

    var lowTemGenLine = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yLowScaler(yAccessorMin(d)));

    var highTemGenLine = d3.line() // generates line for max temp
        .x(d => xScaler(xAccessor(d)))
        .y(d => yHighScaler(yAccessorMax(d)));

    bounded.append("path")
        .attr("d",lowTemGenLine(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","grey")

    bounded.append("path")
        .attr("d",highTemGenLine(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","red")

    const position = dimension.boundedHeight + 10

    bounded.append("g")
        .attr("transform", "translate(100, " + position + ")")
        .call(x_axis);

    bounded.append('text') // adds text on top of graph
        .attr('x', dimension.width/2 + 10)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .style('font-size', 20)
        .style('font-family', 'Monospace')
        .text('Highest temperature (red stroke) and Lowest temperature (grey stroke) by date');

    y_axis.tickFormat( (d,i) => d + "F") // adds Fahrenheit label "F" to temperature
}

buildPlot();
