class Navigation {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        this.disableLinks = this.disableLinks.bind(this);
        const links = document.querySelectorAll('.navigation a');
        links.forEach(link => { link.addEventListener('click', this.disableLinks); })
    }

    disableLinks(evt) {
        evt.preventDefault();
    }
}