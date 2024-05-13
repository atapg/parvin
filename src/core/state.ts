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
            defineProperty: function (target: any, prop: any, descriptor: any) {
                target[prop] = descriptor.value
                return true
            },
        }

        this.state = new Proxy(data, this.handler)
        this.component = component
        this.listeners = {}
    }

    set(target: any, property: any, newValue: any, reciever: any) {
        const oldValue = target[property]

        let stateTarget = null

        if (reciever.property) {
            stateTarget = reciever.property
        } else {
            stateTarget = property
        }

        target[property] = newValue

        this.component.onStateUpdate(oldValue, newValue, property, stateTarget)

        return true
    }

    get(target: any, property: any, newValue: any, receiver: any) {
        if (typeof target[property] === 'object' && target[property] !== null) {
            const proxy = new Proxy(target[property], this.handler)

            Object.defineProperty(proxy, 'property', {
                configurable: true,
                enumerable: true,
                value: property,
            })

            return proxy
        } else {
            return target[property]
        }
    }

    setComponent(component: Component) {
        this.component = component
    }
}

export { State }
