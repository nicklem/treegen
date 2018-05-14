
class SampleHaikuModel {

    constructor() {

        this._haikuSampleData = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum"
        this._wordList = this._haikuSampleData.split(" ");
        this._wlLen = this._wordList.length - 1;

        // INIT SEED WORD
        this._data = { 
            nodes: [{
                text: this._randomSentence(1),
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

        let maxID = startID + 3; // number of new nodes per round

        for (let index = startID; index < maxID; index++) {

            this._data.nodes.push({
                text: this._randomSentence(3),
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

    _randomSentence(numWords) {
        let out = [];

        for (let index = 0; index < numWords; index++) {
            let randIndex = Math.floor(this._wlLen * Math.random());
            out.push(this._wordList[randIndex]);
        }

        return out.join(" ");
    }

    // PUBLIC

    expand(originID) {
        this._expansionRound += 1;
        let startID = this._data.nodes.length;
        this._appendNodes(originID, startID);
        return this;
    }

}
