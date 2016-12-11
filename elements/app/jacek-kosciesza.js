'use strict';

/* eslint-env es6 */

customElements.define('jacek-kosciesza', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        this.actions = [];
        this.isRequestIdleCallbackScheduled = false;

        if (this.log) {
            this.msg = (message) => console.log(message);
        } else {
            this.msg = _ => {};
        }

        this.msg('jacek-kosciesza constructor');
        const doc = document.jk.docs.get('jacek-kosciesza'); //document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jacek-kosciesza-tmpl');
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        
        this.sideNav = new SideNav(this);
        this.cards = new Cards(this);

        this.addEventsListeners();
    }

    addEventsListeners() {
        this._newAction = this._newAction.bind(this);

        this.addEventListener('new-action', this._newAction);
    }

    _newAction(evt) {
        this.actions.push(evt.detail);
        this.schedulePendingEvents();
    }

    get log() {
        return this.hasAttribute('log');
    }

    connectedCallback() {
        this.attachRouter();
    }

    attachRouter() {
        // TODO: this is all quick and dirty - replace it with jk-tabs
        const router = this.shadowRoot.querySelector('jk-router');
        let links = this.shadowRoot.querySelectorAll('nav a')
        for (let link of links) {
            link.addEventListener('click', (evt) => {
                evt.preventDefault();                
                for (let link of links) {
                    link.parentNode.classList.remove('active');
                }
                evt.target.parentNode.classList.add('active');
                router.go(evt.target.href);
            });
        }
    }

    disconnectedCallback() {
        this.sideNav.removeEventListeners();
        this.cards.removeEventListeners();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {

    }

    schedulePendingEvents() {
        // Only schedule the rIC if one has not already been set.
        if (this.isRequestIdleCallbackScheduled)
            return;

        this.isRequestIdleCallbackScheduled = true;

        if ('requestIdleCallback' in window) {
            // Wait at most two seconds before processing events.
            requestIdleCallback(this.processPendingAnalyticsEvents.bind(this), { timeout: 2000 });
        } else {
            this.processPendingAnalyticsEvents();
        }
    }

    processPendingAnalyticsEvents (deadline) {
        // Reset the boolean so future rICs can be set.
        this.isRequestIdleCallbackScheduled = false;

        // If there is no deadline, just run as long as necessary.
        // This will be the case if requestIdleCallback doesn’t exist.
        if (typeof deadline === 'undefined') {
            deadline = { timeRemaining: function () { return Number.MAX_VALUE } };
        }

        // Go for as long as there is time remaining and work to do.
        while (deadline.timeRemaining() > 0 && this.actions.length > 0) {
            var evt = this.actions.pop();

            // ga('send', 'event',
            //     evt.category,
            //     evt.action,
            //     evt.label,
            //     evt.value);
            console.log(`ga(${JSON.stringify(evt)})`);
        }

        // Check if there are more events still to send.
        if (this.actions.length > 0) {
            schedulePendingEvents();
        }
    }
});
