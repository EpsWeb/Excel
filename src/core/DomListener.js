import { capitalize } from "./util"

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No root element provided for DomListenet!')
    }
    this.$root = $root
    this.listeners = listeners
  }

  initDomListeners() {
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener)
      this[methodName] = this[methodName].bind(this)
      // То же самое, что addEventListener
      this.$root.on(listener, this[methodName])
    })
  }

  removeDomListeners() {
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener)
      this.$root.off(listener, this[methodName].bind(this))
    })
  }
}

// input -> onInput
function getMethodName(eventName) {
  return `on${capitalize(eventName)}`
}
