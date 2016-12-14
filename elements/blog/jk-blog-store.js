'use strict'

customElements.define('jk-blog-store', class extends HTMLElement {
    static get observedAttributes() {
        return ['url'];
    }

    constructor() {
        super();
        console.log('jk-blog-store constructor');
    }

    get url() {
        return this.getAttribute('url');
    }

    async getPosts(page = 1) {
        console.log('jk-blog-store get');
        let response = await fetch(`${this.url}?page=${page}`);
        let posts = await response.json();
        this.posts = posts;
        //this.dispatchEvent(new CustomEvent('posts-fetched', {detail: posts}));
        return posts;
    }
});