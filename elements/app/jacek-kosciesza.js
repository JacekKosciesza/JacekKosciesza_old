'use strict';

/* eslint-env es6 */

customElements.define('jacek-kosciesza', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        console.log('jacek-kosciesza constructor');
        const doc = document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jacek-kosciesza-tmpl');
        this._root = this.attachShadow({mode: 'open'});
        this._root.appendChild(tmpl.content.cloneNode(true));
        
        this.showHamburgerMenuButton = this._root.querySelector('.show-hamburger-menu');
        this.hideHamburgerMenuButton = this._root.querySelector('.hide-hamburger-menu');
        this.sideNavEl = this._root.querySelector('.side-nav');
        this.sideNavContainer = this._root.querySelector('.side-nav__container');

        this.showSideNav = this.showSideNav.bind(this);
        this.hideSideNav = this.hideSideNav.bind(this);
        this.blockClicks = this.blockClicks.bind(this);
        this.addEventListeners();
    }

    async connectedCallback() {
        // console.log('1');
        // await new Promise(y => setTimeout(y, 2000));
        // console.log('Hello async/await!');
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

     addEventListeners() {
        this.showHamburgerMenuButton.addEventListener('click', this.showSideNav);
        this.hideHamburgerMenuButton.addEventListener('click', this.hideSideNav);
        this.sideNavEl.addEventListener('click', this.hideSideNav);
        this.sideNavContainer.addEventListener('click', this.blockClicks);
    }

    showSideNav() {
        this.sideNavEl.classList.add('side-nav--visible');
    }

    hideSideNav() {
        this.sideNavEl.classList.remove('side-nav--visible');
    }

    blockClicks(event) {
        event.stopPropagation();
    }
});

