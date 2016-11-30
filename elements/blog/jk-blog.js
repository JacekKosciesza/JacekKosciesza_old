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

        this._playButton = this._root.querySelector('#play'); 
    }

    connectedCallback() {
      this.addEventListeners();
    }

    disconnectedCallback() {
      this.removeEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    addEventListeners() {
        this._playButton.addEventListener('click', this.onPlayButtonClicked);
    }

    removeEventListeners() {
        this._playButton.removeEventListener('click', this.onPlayButtonClicked);
    }

    onPlayButtonClicked() {
        console.log('Play button clicked');
    }
});

