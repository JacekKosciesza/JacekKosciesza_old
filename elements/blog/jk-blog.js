'use strict';

/* eslint-env es6 */

customElements.define('jk-blog', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        console.log('jk-blog constructor');
        const doc = document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jk-blog-tmpl');
        this._root = this.attachShadow({mode: 'open'});
        this._root.appendChild(tmpl.content.cloneNode(true));
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
});

