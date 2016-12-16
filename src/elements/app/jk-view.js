'use strict'

customElements.define('jk-view', class extends HTMLElement {
    constructor() {
        super();
        console.log('jk-view constructor');
    }

    get route() {
        return this.getAttribute('route') || null;
    }

    in(data) {
        return new Promise((resolve, reject) => {
            const onTranistionEnd = () => {
                this.removeEventListener('transitionend', onTranistionEnd);
                resolve();
            };

            this.classList.add('visible');
            this.addEventListener('transitionend', onTranistionEnd);
        });
    }

    out(data) {
        return new Promise((resolve, reject) => {
            const onTranistionEnd = () => {
                this.removeEventListener('transitionend', onTranistionEnd);
                resolve();
            };

            this.classList.remove('visible');
            this.addEventListener('transitionend', onTranistionEnd);
        });
    }

    update(data) {
        console.log(data);
        return Promise.resolve();
    }
});