class Router {
    constructor(routing) {
        this.routing = new Map(routing);
        this.addEventListeners();        
    }

    addEventListeners() {
        this._onNavRequest = this._onNavRequest.bind(this);
        document.addEventListener('nav-request', this._onNavRequest);
    }

    _onNavRequest(evt) {
        let viewName = evt.detail;
        window.history.pushState(null, viewName, `/${viewName}`);
        let view = this.routing.get(viewName);
        view.display();
    }
}