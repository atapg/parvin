import type { Component } from './component'

class State {
    state: Record<string, any>
    listeners: Record<string, Function[]>
    component: Component
    handler: Object = {}

    constructor(data: Record<string, any>, component: Component) {
        this.handler = {
            set: this.set.bind(this),
            get: this.get.bind(this),
        }

        this.state = new Proxy(data, this.handler)
        this.component = component
        this.listeners = {}
    }

    set(target: any, property: any, newValue: any, receiver: any) {
        const oldValue = target[property]

        target[property] = newValue

        this.component.onStateUpdate(oldValue, newValue, property)
    }

    get(target: any, property: any, newValue: any, receiver: any) {
        if (typeof target[property] === 'object' && target[property] !== null) {
            return new Proxy(target[property], this.handler)
        } else {
            return target[property]
        }
    }

    setComponent(component: Component) {
        this.component = component
    }
}

export { State }
