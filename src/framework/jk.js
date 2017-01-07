'use strict';

let JK = (function () {
    let jk = {};

    jk.Element = class extends HTMLElement {
        constructor() {
            super();

            // attach shadow root with template
            const doc = document.currentScript.ownerDocument;
            const tmpl = doc.querySelector(`#${this.constructor.is}`);
            const shadowRoot = this.attachShadow({
                mode: 'open'
            });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));

            // properties configuration
            this.bindings = new Map();
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

            // TODO: rewrite is shitty, quick, dirty and not finished experimentation
            let elementsWithBinding = Array.from(this.shadowRoot.querySelectorAll('[bind]'));
            for (let el of elementsWithBinding) {
                console.log(el);
                let match = el.textContent.match(/{{(.*)}}/);
                if (match) {
                    let bindingPath = match[1];
                    console.log(`textContent = ${bindingPath}`);
                    let propertyName = bindingPath.split('.')[0];
                    this.bindings.get(propertyName).push({
                        el,
                        path: bindingPath.substring(bindingPath.indexOf('.') + 1)
                    });
                }
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
                    let proxy = new Proxy({}, {
                        set: function (target, propertyKey, value) {
                            console.log(`target=${target}, propertyKey=${propertyKey}, value=${value}`);
                            let bindings = this.bindings.get(attrName);
                            for (let binding of bindings) {
                                if (binding.path === propertyKey) {
                                    binding.el.textContent = value;
                                }
                            }
                            return Reflect.set(target, propertyKey, value);
                        }.bind(this)
                    });
                    Object.assign(proxy, JSON.parse(value));
                    return proxy;
                    break;
                default:
                    let bindings = this.bindings.get(attrName);
                    for (let binding of bindings) {
                        binding.el.textContent = value;
                    }
                    return value;
            }
        }
    }

    return jk;
})();