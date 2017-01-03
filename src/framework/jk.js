'use strict';

let JK = (function () {
    let jk = {};

    jk.Element = class extends HTMLElement {
        constructor() {
            super();
            const doc = document.currentScript.ownerDocument;
            const tmpl = doc.querySelector(`#${this.constructor.is}`);
            const shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));
        }

        connectedCallback() {
            console.log(`${this.constructor.is} connectedCallback`);
        }
    }

    return jk;
})();