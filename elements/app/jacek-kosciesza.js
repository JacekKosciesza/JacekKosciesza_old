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
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        
        // this.sideNav = new SideNav(this.shadowRoot);
        // this.cards = new Cards(this.shadowRoot);
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
        //this.sideNav.removeEventListeners();
        //this.cards.removeEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
});
