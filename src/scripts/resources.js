class Resources {
    constructor() {
        this._displayed = false;
        this.PARTIAL_URL = '/views/resources.html';
        this.DATA_URL = 'https://jacekkosciesza-659f4.firebaseio.com/resources.json';
    }

    async display() {
        if (this._displayed) return;
        let partialPromise = this.getResourcesPartial();
        let resourcesPromise = this.getResourcesData();

        let [partial, resources] = await Promise.all([partialPromise, resourcesPromise]);

        if (partial && resources) {
            requestAnimationFrame(_ => this.displayResources(partial, resources));
        }
    }

    async getResourcesPartial() {
        try {
            let response = await fetch(this.PARTIAL_URL);
            let text = await response.text();
            const parser = new DOMParser();
            let partial = parser.parseFromString(text, "text/html");
            return partial;
        } catch (ex) {
            console.error(ex);
        }
    }

    async getResourcesData() {
        try {
            let response = await fetch(this.DATA_URL);
            let resources = await response.json();
            if (resources) {
                console.log(`${resources.length} resource(s) fetched`);
            }
            return resources;
        } catch (ex) {
            console.error(ex);
        }
    }

    displayResources(partial, resources) {
        let view = partial.querySelector('.view');

        let resourcesTmpl = partial.querySelector('#resource-tmpl');
        let linksTmpl = resourcesTmpl.content.querySelector('#link-tmpl');

        for (let resource of resources) {
            let section = resourcesTmpl.content.cloneNode(true);
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

            view.appendChild(section);
        }
        let main = document.querySelector('main');
        main.appendChild(view);
    }
}