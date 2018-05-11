class SampleHaikuModel {

    constructor() {

        // INIT SEED WORD
        this._data = { 
            nodes: [{
                text: "Seed_word",
                id: 0,
                group: 0
            }],
            links: []
        };

        this._appendNodes(0, 1);
        return this;

    }

    // GET

    get nodes() { return this._data.nodes }
    get links() { return this._data.links }

    // PRIVATE

    _appendNodes(originID, startID) {

        let maxID = startID + 4;
        for (let index = startID; index < maxID; index++) {

            this._data.nodes.push({
                text: "Word_" + index,
                id: index,
                group: originID
            });

            this._data.links.push({
                source: originID,
                target: index,
                value: 1
            });
        }
    }

    // PUBLIC

    expandFrom(originID) {
        let startID = this._data.nodes.length;
        this._appendNodes(originID, startID);
        return this;
    }

}
