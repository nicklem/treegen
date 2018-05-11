window.haikuSampleData = "Ihr naht euch wieder schwankende Gestalten Die früh sich einst dem trüben Blick gezeigt Versuch ich wohl euch diesmal festzuhalten Fühl ich mein Herz noch jenem Wahn geneigt Ihr drängt euch zu!  nun gut so mögt ihr walten Wie ihr aus Dunst und Nebel um mich steigt Mein Busen fühlt sich jugendlich erschüttert Vom Zauberhauch der euren Zug umwittert  Ihr bringt mit euch die Bilder froher Tage Und manche liebe Schatten steigen auf Gleich einer alten halbverklungnen Sage Kommt erste Lieb und Freundschaft mit herauf Der Schmerz wird neu es wiederholt die Klage Des Lebens labyrinthisch irren Lauf Und nennt die Guten die um schöne Stunden Vom Glück getäuscht vor mir hinweggeschwunden  Sie hören nicht die folgenden Gesänge Die Seelen denen ich die ersten sang Zerstoben ist das freundliche Gedränge Verklungen ach!  der erste Widerklang Mein Lied ertönt der unbekannten Menge Ihr Beifall selbst macht meinem Herzen bang Und was sich sonst an meinem Lied erfreuet Wenn es noch lebt irrt in der Welt zerstreuet  Und mich ergreift ein längst entwöhntes Sehnen Nach jenem stillen ernsten Geisterreich Es schwebet nun in unbestimmten Tönen Mein lispelnd Lied der Äolsharfe gleich Ein Schauer faßt mich Träne folgt den Tränen Das strenge Herz es fühlt sich mild und weich Was ich besitze seh ich wie im Weiten Und was verschwand wird mir zu Wirklichkeiten"

class SampleHaikuModel {

    constructor() {

        this._wordList = window.haikuSampleData.split(" ");
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

        let maxID = startID + 5; // number of new words per round

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
