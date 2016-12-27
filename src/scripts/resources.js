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

        for (let resource of resources) {
            let section = document.createElement('section');
            let h2 = document.createElement('h2');
            h2.innerText = resource.title;
            let ul = document.createElement('ul');
            for (let link of resource.links) {
                let a = document.createElement('a');
                a.innerText = link.title;
                a.href = link.url;
                a.rel = 'nofollow';
                let li = document.createElement('li');
                li.appendChild(a);
                ul.appendChild(li);
            }
            section.appendChild(h2);
            section.appendChild(ul);
            main.appendChild(section);
        }        
    }
}