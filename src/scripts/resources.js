class Resources extends View {
    constructor() {
        super('/views/resources.html');
        this.DATA_URL = 'https://jacekkosciesza-659f4.firebaseio.com/resources.json';
    }

    async display() {
        let partialPromise = this._getPartial();
        let dataFromCachedPromise = this._getDataFromCache();
        let dataFromNetworkPromise = this._getDataFromNetwork();

        // cache first
        this._display(partialPromise, dataFromCachedPromise, false);

        // then network
        this._display(partialPromise, dataFromNetworkPromise, true);
    }

    async _display(partialPromise, dataPromise, isFromNetwork) {
        let [partial, resources] = await Promise.all([partialPromise, dataPromise]);
        if (partial && resources && !this._displayed) {
            if (isFromNetwork) {
                this._displayed = true;
                console.log('Displaying resource(s) from network');
            } else {
                console.log('Displaying resource(s) from cache');
            }
            requestAnimationFrame(_ => this._displayPartial(partial, resources));
        }
    }

    async _getDataFromCache() {
        if ('caches' in window) {
            let response = await caches.match(this.DATA_URL);
            if (response) {
                let resources = await response.json();
                console.log(`${resources.length} resource(s) fetched from cache`);
                return resources;
            } else {
                console.log(`No resource(s) in cache`);
            }
        }
    }

    async _getDataFromNetwork() {
        try {
            let response = await fetch(this.DATA_URL);
            let resources = await response.json();
            if (resources) {
                console.log(`${resources.length} resource(s) fetched from network`);
            }
            return resources;
        } catch (ex) {
            console.error(`Error fetching resource(s) from network`, ex);
        }
    }

    _displayPartial(partial, resources) {
        let view = partial.cloneNode(true).querySelector('.view');

        let resourcesTmpl = partial.querySelector('#resource-tmpl');
        let linksTmpl = resourcesTmpl.content.querySelector('#link-tmpl');

        for (let resource of resources) {
            let section = resourcesTmpl.content.cloneNode(true);
            section.querySelector('template').remove();
            let h2 = section.querySelector('h2');
            h2.innerText = resource.title;
            let ul = section.querySelector('ul');
            for (let link of resource.links) {
                let li = linksTmpl.content.cloneNode(true);
                let a = li.querySelector('a');
                a.innerText = link.title;
                a.href = link.url;
                ul.appendChild(li);
            }
            let article = view.querySelector('article');
            article.appendChild(section);
        }
        let main = document.querySelector('main');
        main.innerHTML = '';
        view.querySelector('template').remove();
        main.appendChild(view);
    }
}