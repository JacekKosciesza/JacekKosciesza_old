'use strict';

/* eslint-env es6 */

customElements.define('jacek-kosciesza', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        if (this.hasAttribute('log')) {
            this.log = (message) => console.log(message);
        } else {
            this.log = _ => {};
        }

        this.log('jacek-kosciesza constructor');
        const doc = document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jacek-kosciesza-tmpl');
        this._root = this.attachShadow({mode: 'open'});
        this._root.appendChild(tmpl.content.cloneNode(true));
        
        this.sideNav = new SideNav(this._root);
        this.cards = new Cards(this._root);
    }

    /*async*/ connectedCallback() {
        // console.log('1');
        // await new Promise(y => setTimeout(y, 2000));
        // console.log('Hello async/await!');
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    _log(message) {
        console.log(message);
    }
});
