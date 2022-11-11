async function build() {

  const dataset = await d3.csv("data.csv");

  var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 300,
            right: 0,
            bottom: 0,
            left: 400,
        },
    };

  dimension.boundedWidth = dimension.width - dimension.margin.right - dimension.margin.left;
  dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

  const data = Object.entries(dataset)
    .map((entry, y, arr) => {
      const entryElement = entry[1];
      const targets = dataset.columns.slice(1);
      const source = Object.values(entryElement)[0];
      return targets
        .map((target, x) => ({
          id: `${source}-${target}`, x, y,
          weight: parseInt(entry[1][target] || "0"),
        }))
        .slice(0,arr.length);
    })
    .slice(0,Object.entries(dataset).length-1)
    .flat();

  const nodesX = dataset.columns.slice(1);
  const nodesY = Object.values(dataset)
    .map((value) => Object.values(value)[0])
    .slice(0, dataset.length);


  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width",dimension.width)
    .attr("height",dimension.height);

  const bounds = wrapper.append("g")
    .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

  const pole = bounds.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","grid")
    .attr("width",25)
    .attr("height",25)
    .attr("x",(d)=>d.x*25)
    .attr("y",(d)=>d.y*25)
    .style("fill-opacity",(d)=>d.weight*0.2);

  const namesX = wrapper.append("g")
    .attr("transform",`translate(${dimension.margin.left},${dimension.margin.top - 5})`)
    .selectAll("text")
    .data(nodesX)
    .enter()
    .append("text")
    .attr("y",(d,i)=>i*25+12.5)
    .text((d)=>d)
    .style("text-anchor","start")
    .attr("transform","rotate(270)");

  const namesY = wrapper.append("g")
    .attr("transform", `translate(${dimension.margin.left - 10},${dimension.margin.top})`)
    .selectAll("text")
    .data(nodesY)
    .enter()
    .append("text")
    .attr("y",(d,i)=>i*25+12.5)
    .text((d)=>d)
    .style("text-anchor","end");
}

build();
