class HaikuView {

    constructor(data) {
        this._getWidthHeight()
            ._initSVG()
            ._render(data);
    }

    // PUBLIC

    update(lastData, originElement) {
        const origin = {
            x: originElement.x.baseVal[0].value,
            y: originElement.y.baseVal[0].value
        }
        const newLinks = lastData.links.map(d => Object.create(d));
        const newNodes = lastData.nodes.map(d => {
            let out = Object.create(d)
            out.x = origin.x;
            // out.x = this._windowWidth / 2;
            out.y = origin.y;
            // out.y = this._windowHeight / 2;
            return out;
        });
        let nodes = this._node.data().concat(newNodes);
        let links = this._link.data().concat(newLinks);
        this._redraw(links, nodes, newNodes);
        return this;
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

    _initSVG() {
        let svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElem.setAttributeNS(null, "viewBox", "0 0 " + this._windowWidth + " " + this._windowHeight);
        svgElem.setAttributeNS(null, "width", this._windowWidth);
        svgElem.setAttributeNS(null, "height", this._windowHeight);
        svgElem.style.display = "block";
        document.getElementById("svgContainer").appendChild(svgElem);
        this._svg = d3.select(svgElem);
        return this;
    }

    _setSimulation(links, nodes) {

        let ticked = () => {
            this._link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            this._node
                .attr("x", d => d.x)
                .attr("y", d => d.y)
        }

        this._simulation = d3.forceSimulation(nodes)
            .force(
                "link",
                d3.forceLink(links)
                    .strength(0.08)
                    .id(d => d.id)
            )
            .force(
                "charge",
                d3.forceManyBody()
                    .distanceMin(60)
<<<<<<< HEAD
                    .distanceMax(1000)
=======
>>>>>>> a3f8a6b3e9807c3e0e03167c2275d62a497cf950
                    .strength(-300)
            )
            .force(
                "collide",
                d3.forceCollide()
                    .radius(50)
                    .strength(0.1)
            )
            .force(
                "center",
                d3.forceCenter(this._windowWidth / 2, this._windowHeight / 2)
            )
            // .force(
            //     "forceX",
            //     d3.forceX(this._windowWidth / 2)
            //         .strength(0.2)
            // )
            // .force(
            //     "forceY",
            //     d3.forceY(this._windowHeight / 2)
            //         .strength(0.2)
            // )
            .on("tick", ticked);
    }

    _render(data) {
        let newText = data.nodes[0].text;
        let textField = document.getElementById("textField");
        textField.innerHTML = textField.innerHTML + " " + newText; 
        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));
        this._redraw(links, nodes);
        return this;
    };

    _redraw(links, nodes, newNodes) {
        this._setSimulation(links, nodes);
        this._svg.selectAll("*").remove();
        this._SVGLinks(links);
        this._SVGNodes(nodes);
        this._simulation.alphaTarget(0.3).restart();
    }

    _SVGLinks(links) {
        this._link = this._svg.append("g")
            .attr("id", "links")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.value));
    }

    _SVGNodes(nodes) {
        this._node = this._svg.append("g")
            .attr("id", "nodes")
            .attr("font-family", "sans-serif")
            .attr("font-size", 15)
            .attr("style", "text-transform: uppercase")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text(d => d.text)
            .attr("fill", this._color())
            .attr("id", d => d.id)
            .on("click", this._clickHandler)
            .call(this._drag(this._simulation));
    }

    _color() {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }

    _drag(simulation) {
        let dragstarted = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        let dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        let dragended = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    _updateTextField(text) {
    }
    // EVENT DISPATCH

    _clickHandler() {
        let newText = this.innerHTML;
        let textField = document.getElementById("textField");
        textField.innerHTML = textField.innerHTML + " " + newText; 

        let originID = parseInt(
            d3.select(this).attr("id").split("_")[1]
        );
        window.haikuApp.updateTree(originID, this);
        return this;
    }
}

