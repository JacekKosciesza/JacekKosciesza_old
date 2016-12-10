'use strict'

customElements.define('jk-edit-comment', class extends HTMLElement {
    constructor() {
        super();

        console.log('jk-edit-comment constructor');

        const doc = document.jk.docs.get('jk-edit-comment');
        const tmp = doc.querySelector('#jk-edit-comment');
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmp.content.cloneNode(true));

        this._bodyTextArea = this.shadowRoot.querySelector('#body');
        this._cancelButton = this.shadowRoot.querySelector('#cancel');
        this._commentButton = this.shadowRoot.querySelector('#comment');

        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    addEventListeners() {
        this._onBodyTextAreaChanged = this._onBodyTextAreaChanged.bind(this);
        this._onCancelButtonClicked = this._onCancelButtonClicked.bind(this);
        this._onCommentButtonClicked = this._onCommentButtonClicked.bind(this);
        

        this._bodyTextArea.addEventListener('change', this._onBodyTextAreaChanged);
        this._cancelButton.addEventListener('click', this._onCancelButtonClicked);
        this._commentButton.addEventListener('click', this._onCommentButtonClicked);
    }

    removeEventListeners() {
        this._bodyTextArea.removeEventListener('change', this._onBodyTextAreaChanged);
        this._cancelButton.removeEventListener('click', this._onCancelButtonClicked);
        this._commentButton.removeEventListener('click', this._onCommentButtonClicked);
    }

    _onBodyTextAreaChanged(evt) {
    }

    _onCancelButtonClicked(evt) {

    }

    _onCommentButtonClicked() {
        let event = new CustomEvent('jk-new-comment', { detail: { body: this._bodyTextArea.value }, bubbles: false});
        this.dispatchEvent(event);
    }
});