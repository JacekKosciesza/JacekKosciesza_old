'use strict';

/* eslint-env es6 */

customElements.define('jacek-kosciesza', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        if (this.log) {
            this.msg = (message) => console.log(message);
        } else {
            this.msg = _ => {};
        }

        this.msg('jacek-kosciesza constructor');
        const doc = document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jacek-kosciesza-tmpl');
        this._root = this.attachShadow({mode: 'open'});
        this._root.appendChild(tmpl.content.cloneNode(true));
        
        // this.sideNav = new SideNav(this._root);
        // this.cards = new Cards(this._root);
    }

    get log() {
        return this.hasAttribute('log');
    }

    connectedCallback() {
        this.attachRouter();
    }

    attachRouter() {
        const router = this._root.querySelector('jk-router');

        for (let link of this._root.querySelectorAll('nav a')) {
            link.addEventListener('click', (evt) => {
                evt.preventDefault();
                router.go(evt.target.href);
            });
        }
    }

    disconnectedCallback() {
        //this.sideNav.removeEventListeners();
        //this.cards.removeEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
});
