class HaikuController {
    constructor() {
        this._model = new SampleHaikuModel();
        this._view = new HaikuView(this._model.data);
    }

    // PUBLIC

    updateTree(originID, originElement) {
        this._model.expand(originID);
        this._view.update(this._model.lastData, originElement);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.haikuApp = new HaikuController();
});