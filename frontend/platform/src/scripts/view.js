class View {
    constructor(partialUrl) {
        this._displayed = false;
        this.partialUrl = partialUrl;
    }

    async display() {
        if (this._displayed) return;
        let partial = await this._getPartial();

        if (partial) {
            requestAnimationFrame(_ => this._displayPartial(partial));
        }
    }

    async _getPartial() {
        try {
            let response = await fetch(this.partialUrl);
            let text = await response.text();
            const parser = new DOMParser();
            let partial = parser.parseFromString(text, "text/html");
            console.log(`Partial '${this.partialUrl}' fetched`);
            return partial;
        } catch (ex) {
            console.error(ex);
        }
    }

    _displayPartial(partial) {
        let view = partial.querySelector('.view');
        let main = document.querySelector('main');
        main.innerHTML = '';
        main.appendChild(view);
    }
}