'use strict';

let JK = (function () {
    let jk = {};

    class JKElement extends HTMLElement {
        constructor() {
            super();

            // attach shadow root with template
            const doc = document.currentScript.ownerDocument;
            const tmpl = doc.querySelector(`#${this.constructor.is}`);
            const shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this.configureProperties();
            this.configureBindings();
        }

        configureProperties() {
            this.bindings = new Map();
            if (this.constructor.config && this.constructor.config.properties) {
                for (let [key] of Object.entries(this.constructor.config.properties)) {
                    // create empty binding
                    this.bindings.set(key, []);

                    // create getter and setter
                    Reflect.defineProperty(this, key, {
                        get: function () {
                            return this[`_${key}`];
                        },
                        set: function (value) {
                            this[`_${key}`] = this._setProperty(key, value);
                        }
                    });
                }
            }
        }

        configureBindings() {
            this._walkTree();
        }

        _walkTree() {
            var walker = document.createTreeWalker(
                this.shadowRoot,
                NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
                function (node) {
                    if (node.nodeType == Node.TEXT_NODE) {
                        let binding = node.textContent.match(/{{(.*)}}/);
                        if (binding) {
                            let path = binding[1];
                            let property = path.split('.')[0];
                            this.bindings.get(property).push({
                                node,
                                path: path.substring(path.indexOf('.') + 1)
                            });
                            return NodeFilter.FILTER_ACCEPT;
                        } else {
                            return NodeFilter.FILTER_SKIP;
                        }
                    }

                    if (node.nodeType == Node.ELEMENT_NODE) {
                        if (node.attributes.length) {
                            for (let attribute of node.attributes) {
                                return isBinding(attribute.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                            }
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }.bind(this),
                false);

            function isBinding(text) {
                var re = new RegExp();
                re.compile("^{{(.*)}}$");

                return text.match(re);
            }

            while (walker.nextNode()) {
                console.log(walker.currentNode);
            }
        }

        connectedCallback() {
            console.log(`JK.Element(${this.constructor.is}) connectedCallback`);
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            console.log(`JK.Element(${this.constructor.is}) attrName=${attrName}, oldVal=${oldVal}, newVal=${newVal}`);
            this[attrName] = newVal;
        }

        disconnectedCallback() {
            console.log(`JK.Element(${this.constructor.is}) disconnectedCallback`);
        }

        // TODO: rewrite is shitty, quick, dirty and not finished experimentation
        _setProperty(attrName, value) {
            let type = this.constructor.config.properties[attrName];
            let self = this;
            switch (type) {
                case 'Object':
                    {
                        // create poxy
                        let proxy = new Proxy({}, {
                            set: function (target, propertyKey, value) {
                                console.log(`Object proxy: target=${target}, propertyKey=${propertyKey}, value=${value}`);
                                let bindings = this.bindings.get(attrName);
                                for (let binding of bindings) {
                                    if (binding.path === propertyKey) {
                                        binding.node.textContent = value;
                                    }
                                }
                                return Reflect.set(target, propertyKey, value);
                            }.bind(this)
                        });
                        // initialize object
                        Object.assign(proxy, JSON.parse(value));
                        return proxy;
                    }
                case 'Array':
                    {
                        // create proxy
                        let proxy = new Proxy([], {
                            set: function (target, propertyKey, value) {
                                console.log(`Array proxy: target=${target}, propertyKey=${propertyKey}, value=${value}`);
                                return Reflect.set(target, propertyKey, value);
                            }.bind(this)
                        });
                        // initialize array
                        for (let item of JSON.parse(value)) {
                            proxy.push(item);
                        }
                        return proxy;
                    }
                default:
                    let bindings = this.bindings.get(attrName);
                    for (let binding of bindings) {
                        binding.node.textContent = value;
                    }
                    return value;
            }
        }
    }

    class DomRepeat extends HTMLElement {
        static get is() {
            return 'dom-repeat';
        }

        get items() {
            return this.getAttribute('items');
        }

        get as() {
            return this.getAttribute('as');
        }

        constructor() {
            super();
            let shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.innerHTML = '<template><slot><slot><template>';
        }
    }
    customElements.define(DomRepeat.is, DomRepeat);

    function importHtml(href) {
        let isAlreadyImported = document.querySelector(`head > link[href="${href}"]`);
        if (!isAlreadyImported) {
            let link = document.createElement('link');
            link.setAttribute('rel', 'import');
            link.setAttribute('href', href);
            document.head.appendChild(link);
        }
    }

    // public API
    jk.Element = JKElement;
    jk.importHtml = importHtml;

    return jk;
})();