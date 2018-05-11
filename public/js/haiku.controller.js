class HaikuController {
    constructor() {
        this._model = new SampleHaikuModel();
        this._view = new HaikuView(this._model);
        console.log(this._model);
    }

    // PUBLIC

    updateTree(originID) {
        this._model.expandFrom(originID);
        // TODO Fix redraw
        this._view._init(this._model);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.haikuApp = new HaikuController();
});