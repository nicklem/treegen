class SampleHaikuModel {

    constructor() {

        // INIT SEED WORD
        this._data = { 
            nodes: [{
                text: "Seed_word",
                id: "_0",
                group: 0
            }],
            links: []
        };

        this._expansionRound = 0;

        this._appendNodes(0, 1);
        return this;

    }

    // GET

    get data() {
        return {
            nodes: this._data.nodes,
            links: this._data.links,
        }
    }

    get lastData() {
        return {
            nodes: this._data.nodes.filter( (el) => el.group == this._expansionRound ),
            links: this._data.links.filter( (el) => el.group == this._expansionRound ),
        }
    }

    // PRIVATE

    _appendNodes(originID, startID) {

        let maxID = startID + 5; // number of new words per round

        for (let index = startID; index < maxID; index++) {

            this._data.nodes.push({
                text: "word_" + index,
                id: "_" + index,
                group: this._expansionRound
            });

            this._data.links.push({
                source: "_" + originID,
                target: "_" + index,
                value: 1,
                group: this._expansionRound
            });
        }
    }

    // PUBLIC

    expand(originID) {
        this._expansionRound += 1;
        let startID = this._data.nodes.length;
        this._appendNodes(originID, startID);
        return this;
    }

}
