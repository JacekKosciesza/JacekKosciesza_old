class Resources {
    constructor() {
        this._displayed = false;
    }

    async display() {
        if (this._displayed) return;
        let resources = await this.getResources();
        if (resources) {
            requestAnimationFrame(_ => this.displayResources(resources));
        }
    }

    async getResources() {
        let resources = [];
        try {
            let response = await fetch('https://jacekkosciesza-659f4.firebaseio.com/resources.json');
            resources = await response.json();
            if (resources) {
                console.log(`${resources.length} resource(s) fetched`);
            }
        } catch (ex) {
            console.error(ex);
        }

        return resources;
    }

    displayResources(resources) {
        let main = document.querySelector('main');
        let ul = document.createElement('ul');
        for (let resource of resources) {
            let a = document.createElement('a');
            a.innerText = resource.title;
            a.href = resource.url;
            a.rel = 'nofollow';
            let li = document.createElement('li');            
            li.appendChild(a);
            ul.appendChild(li);
        }
        main.appendChild(ul);
    }
}