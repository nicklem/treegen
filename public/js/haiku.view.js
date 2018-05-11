class HaikuView {

    constructor(data) {
        this._getWidthHeight()
            ._SVG("svgContainer")
            ._init(data);
    }

    // PRIVATE

    _getWidthHeight() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName("body")[0];
        this._windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;
        this._windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
        return this;
    }

    _SVG(container) {
        this._svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._svgElem.setAttributeNS(null, "viewBox", "0 0 " + this._windowWidth + " " + this._windowHeight);
        this._svgElem.setAttributeNS(null, "width", this._windowWidth);
        this._svgElem.setAttributeNS(null, "height", this._windowHeight);
        this._svgElem.style.display = "block";
        document.getElementById(container).appendChild(this._svgElem);
        return this;
    }

    _init(data) {
        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        const simulation = d3.forceSimulation(nodes)
            .force(
                "link",
                d3.forceLink(links)
                    .strength(0.2)
                    .id(d => d.id)
            )
            .force(
                "charge",
                d3.forceManyBody()
                    .strength(-200)
            )
            .force(
                "center",
                d3.forceCenter(this._windowWidth / 2, this._windowHeight / 2))
            .on("tick", ticked);

        const svg = d3.select(this._svgElem);
        svg.selectAll("*").remove();

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
            .text(d => d.text)
            .attr("fill", this._color())
            .attr("id", d => d.id)
            .on("click", this._dispatchClick)
            .call(this._drag(simulation));
        
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

        // return svg.node();
    };

    _color() {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }

    _drag(simulation) {

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

    // EVENT DISPATCH

    _dispatchClick() {
        let originID = parseInt(
            d3.select(this).attr("id")
        );
        window.haikuApp.updateTree(originID);
    }


}

