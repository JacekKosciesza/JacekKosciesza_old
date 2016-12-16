'use strict';

/* eslint-env es6 */

customElements.define('jk-blog', class extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        console.log('jk-blog constructor');
        const doc = document.jk.docs.get('jk-blog'); //document.currentScript.ownerDocument;
        const tmpl = doc.querySelector('#jk-blog-tmpl');
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }

    connectedCallback() {
        this._playButton = this.shadowRoot.querySelector('#play');
        this._textToSpeak = this.shadowRoot.querySelector('#text');
        this._editComment = this.shadowRoot.querySelector('#editComment');
        this._blogStore = this.shadowRoot.querySelector('jk-blog-store');

        this.getPosts();
        
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    addEventListeners() {        
        this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
        this._onNewComment = this._onNewComment.bind(this);

        //this._playButton.addEventListener('click', _ => this.onPlayButtonClicked());
        if (this._playButton) { this._playButton.addEventListener('click', this.onPlayButtonClicked); }
        this._editComment.addEventListener('jk-new-comment', this._onNewComment);
    }

    removeEventListeners() {
        this._playButton.removeEventListener('click', this.onPlayButtonClicked);
        this.removeEventListener('jk-new-comment', this._onNewComment);
    }

    onPlayButtonClicked() {
        console.log('Play button clicked');
        var synth = window.speechSynthesis;
        var utterThis = new SpeechSynthesisUtterance(this._textToSpeak.innerText);
        synth.speak(utterThis);
    }

    async getPosts() {
        let posts = await this._blogStore.getPosts();
        posts.forEach((post) => {
            let jkPost = document.createElement('jk-post');
            //jkPost.post = post;
            jkPost.setAttribute('post', JSON.stringify(post));

            let postsDiv = this.shadowRoot.querySelector('#posts');
            postsDiv.appendChild(jkPost);
        });
    }

    _onNewComment(evt) {
        console.log(`New comment: ${JSON.stringify(evt.detail)}`);
    }
});