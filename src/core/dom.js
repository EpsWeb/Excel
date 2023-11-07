export class Dom {
    constructor(selectorOrNode) {
        this.nativeElement = typeof selectorOrNode === "string" ? document.querySelector(selectorOrNode) : selectorOrNode;
    }

    html(html) {
        if (typeof html === "string") {
            this.nativeElement.innerHTML = html;
            return this;
        }
        return this.nativeElement.outerHTML.trim();
    }

    clear() {
        this.html("");
        return this;
    }

    on(eventType, callback) {
        this.nativeElement.addEventListener(eventType, callback);
    }

    off(eventType, callback) {
        this.nativeElement.removeEventListener(eventType, callback);
    }

    append(nodeOrDomObject) {
        let node = nodeOrDomObject;
        if (nodeOrDomObject instanceof Dom) {
            node = nodeOrDomObject.nativeElement;
        }
        this.nativeElement.appendChild(node);
        return this;
    }

    get data() {
        return this.nativeElement.dataset;
    }

    closest(selector) {
        return $(this.nativeElement.closest(selector));
    }

    css(styles = {}) {
        Object.keys(styles).forEach((key) => {
            this.nativeElement.style[key] = styles[key];
        });
    }

    getCoords() {
        return this.nativeElement.getBoundingClientRect();
    }

    id(parse) {
        if (parse) {
            const parsed = this.data.id.split(":");
            return {
                row: +parsed[0], col: +parsed[1],
            };
        }
        return this.data.id;
    }

    focus() {
        this.nativeElement.focus();
        return this;
    }

    find(selector) {
        return $(this.nativeElement.querySelector(selector));
    }

    findAll(selector) {
        return this.nativeElement.querySelectorAll(selector);
    }

    addClass(className) {
        this.nativeElement.classList.add(className);
        return this
    }

    removeClass(className) {
        this.nativeElement.classList.remove(className);
        return this
    }

    text(text) {
        if (typeof text === "string") {
            this.nativeElement.textContent = text;
            return this;
        }
        if (this.nativeElement.tagName.toLowerCase() === "input") {
            return this.nativeElement.value.trim();
        }
        return this.nativeElement.textContent.trim();
    }
}

export function $(selectorOrNode) {
    return new Dom(selectorOrNode);
}

$.create = (tagName, classes = "") => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    return $(el);
};
