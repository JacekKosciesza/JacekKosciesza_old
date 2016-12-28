class Router {
    constructor(routing) {
        this.routing = new Map(routing);
        this.addEventListeners();
    }

    addEventListeners() {
        this._onNavRequest = this._onNavRequest.bind(this);
        document.addEventListener('nav-request', this._onNavRequest);
    }

    async _onNavRequest(evt) {
        let viewName = evt.detail.viewName;
        //window.history.pushState(null, viewName, `/${viewName}`);
        let view = this.routing.get(viewName);
        await view.display();
        this._manageFocus(evt.detail.isUserInteraction);
    }

    _manageFocus(isUserInteraction) {
        // focus management
        if (isUserInteraction) {
            let main = document.querySelector('main');
            let h1 = main.querySelector('h1[tabindex="-1"]');
            h1.focus();
        }
    }
}