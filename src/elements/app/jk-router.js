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
        for (let view of document.querySelector('jacek-kosciesza').shadowRoot.querySelectorAll('jk-view')) {
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

        // Store the new view.
        this._newView = this._routes.get(route);

        // We don't want to create more promises for the outgoing view animation,
        // because then we get a lot of hanging Promises, so we add a boolean gate
        // here to stop if there's already a transition running.
        if (this._isTransitioningBetweenViews) {
            return;
        }

        this._isTransitioningBetweenViews = true;

        let outViewPromise = Promise.resolve();

        // If there is a current view...
        if (this._currentView) {
            // ...and it's the one we already have, just update it.
            if (this._currentView === this._newView) {
                // No transitions, so remove the boolean gate.
                this._isTransitioningBetweenViews = false;
                
                return this._currentView.update(data);
            }

            // Otherwise animate it out, and take the Promise made by the view as an
            // indicator that the view is done.
            outViewPromise = this._currentView.out(data);
        }

        await outViewPromise;

        // Whenever the outgoing animation is done (which may be immediately if
        // there isn't one), update the references to the current view, allow
        // outgoing animations to proceed.
        this._currentView = this._newView;
        this._isTransitioningBetweenViews = false;
        this._newView.in(data);
    }
});