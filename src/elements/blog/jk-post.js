// TODO: use Web Share API (https://developers.google.com/web/updates/2016/10/navigator-share)

customElements.define('jk-post', class extends HTMLElement {
    static get observedAttributes() {
        return ['post'];
    }

    constructor() {
        super();

        console.log('jk-post constructor');    
        const doc = document.jk.docs.get('jk-post'); //document.currentScript.ownerDocument;
        const tmp = doc.querySelector('#jk-post');
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmp.content.cloneNode(true));
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'post') {
            this.post = JSON.parse(newValue);
            let title = this.shadowRoot.querySelector('#title');
            let body = this.shadowRoot.querySelector('#body');
            title.innerText = this.post.title || '';
            body.innerHTML = this.post.body || '';
        }
    }
});