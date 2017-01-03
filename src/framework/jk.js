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
            console.log(`JK.Element(${this.constructor.is}) connectedCallback`);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            console.log(`JK.Element(${this.constructor.is}) attrName=${attrName}, oldVal=${oldVal}, newVal=${newVal}`);        
            this[attrName] = this._setProperty(attrName, newVal);
        }

        disconnectedCallback() {
            console.log(`JK.Element(${this.constructor.is}) disconnectedCallback`);
        }

        _setProperty(attrName, value) {
            let type = this.constructor.config.properties[attrName];
            switch (type) {
                case 'Object':
                    return JSON.parse(value);
                    break;
                default:
                    return value;
            }
        }
    }

    return jk;
})();