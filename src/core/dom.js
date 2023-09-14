export class Dom {
  constructor(selectorOrNode) {
    this.nativeElement =
      typeof selectorOrNode === "string"
        ? document.querySelector(selectorOrNode)
        : selectorOrNode;
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

  getCoords() {
    return this.nativeElement.getBoundingClientRect();
  }

  css(styles = {}) {
    Object.keys(styles).forEach((key) => {
        this.nativeElement.style[key] = styles[key];
    });
}

  findAll(selector) {
    return this.nativeElement.querySelectorAll(selector);
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
