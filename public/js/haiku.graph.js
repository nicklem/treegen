var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0];

width = w.innerWidth || e.clientWidth || g.clientWidth;
height = w.innerHeight || e.clientHeight || g.clientHeight;

createSVG = () => {
    var xmlns = "http://www.w3.org/2000/svg";

    var svgElem = document.createElementNS(xmlns, "svg");
    svgElem.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
    svgElem.setAttributeNS(null, "width", width);
    svgElem.setAttributeNS(null, "height", height);
    svgElem.style.display = "block";

    var svgContainer = document.getElementById("svgContainer");
    svgContainer.appendChild(svgElem);

    return svgElem;
}

chart = () => {
    const links = data.links_a.map(d => Object.create(d));
    const nodes = data.nodes_a.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force(
            "link",
            d3.forceLink(links)
              .id(d => d.id)
              .strength(0)
              .distance(300)
            )
        .force(
            "charge",
            d3.forceManyBody()
              .strength(-200)
            )
        .force(
            "center",
            d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    const svg = d3.select(createSVG());

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 25)
        .attr("style", "text-transform: uppercase")
        .attr("text-anchor", "middle")
        .text(d => d.id)
        .attr("fill", color())
        .on("click", function() { clicked(this); })
        .call(drag(simulation));

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)
    }

    return svg.node();
};

color = () => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
}

clicked = (thisEl) => {
    var color = "#a00",
        fontSize = 25;
    var el = d3.select(thisEl);
    var originalColor = el.attr("fill");
    var originalFontSize = el.attr("font-size");

    d3.select(thisEl)
        .transition()
            .attr("fill", color)
            .attr("font-size", fontSize)
        .transition()
            .attr("fill", originalColor)
            .attr("font-size", originalFontSize);
}

drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        chart();
    }
}
xmlhttp.open("GET", "public/js/dummy_data/miserables_sample.json", true);
xmlhttp.send();