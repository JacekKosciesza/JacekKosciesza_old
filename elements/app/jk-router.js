'use strict'

customElements.define('jk-router', class extends HTMLElement {
    constructor() {
        super();

        console.log('jk-router constructor');

        this.onChanged = this.onChanged.bind(this);
        this._routes = new Map();

        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('popstate', this.onChanged);
    }

    connectedCallback() {
        this.clearRoutes();
        this.createRoutes();
        this.onChanged();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    removeEventListeners() {
        window.removeEventListener('popstate', this.onChanged);
    }

    createRoutes() {
        // TODO: figure out way to access shadow root of parent element?
        for (let view of document.querySelector('jacek-kosciesza')._root.querySelectorAll('jk-view')) {
            console.log(view);

            if (!view.route) {
                continue;
            }

            console.log(new RegExp(view.route, 'i'), view);

            this.createRoute(new RegExp(view.route, 'i'), view);
        }
    }

    clearRoutes() {
        this._routes.clear();
    }

    createRoute(route, view) {
        if (this._routes.has(route)) {
            return console.warn(`Route already exists: ${route}`);
        }

        this._routes.set(route, view);
    } 

    go(url) {
        window.history.pushState(null, null, url);
        this.onChanged();
    }

    async onChanged(evt) {
        const path = window.location.pathname;
        const routes = Array.from(this._routes.keys());
        const route = routes.find(r => r.test(path));
        const data = route.exec(path);

        if (!route) {
            route;
        }

        // figure out the new view
        this._newView = this._routes.get(route);

        if (this._animating) {
            return;
        }

        this._animating = true;

        let outViewPromise = Promise.resolve();

        // if there is a current view
        if (this._currentView) {
            // if it's the one we already have, just update it
            if (this._currentView === this._newView) {
                this._animating = false;
                return this._currentView.update(data);
            }

            // otherwise we animate it out
            outViewPromise = this._currentView.out(data);
        }

        await outViewPromise;

        this._currentView = this._newView;
        this._animating = false;
        this._newView.in(data);
    }
});