class Router {
    constructor(routing) {
        this.routing = new Map(routing);
        this.addEventListeners();
        this.spinner = document.querySelector('.loader');
    }

    addEventListeners() {
        this._onNavRequest = this._onNavRequest.bind(this);
        document.addEventListener('nav-request', this._onNavRequest);
    }

    async _onNavRequest(evt) {
        this._showSpinner();
        let viewName = evt.detail.viewName;
        this._changeTitle(viewName);
        //window.history.pushState(null, viewName, `/${viewName}`);
        let view = this.routing.get(viewName);
        await view.display();
        this._manageFocus(evt.detail.isUserInteraction);
        this._hideSpinner();
    }

    _changeTitle(viewName) {
        const title = `${this._capitalizeFirstLetter(viewName)} · Jacek Kościesza`;
        document.title = title;
    }

    _manageFocus(isUserInteraction) {
        // focus management
        if (isUserInteraction) {
            let main = document.querySelector('main');
            let h1 = main.querySelector('h1[tabindex="-1"]');
            h1.focus();
        }
    }

    _capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    _showSpinner() {
        this.spinner.hidden = false;
    }

    _hideSpinner() {
        this.spinner.hidden = true;
    }
}