import { Element } from './element'

class Component extends Element {
    name
    template

    constructor(
        name: string,
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        template: string = '',
    ) {
        super(tag, props, [])
        this.name = name
        this.template = template
    }

    // Update data method
    updateData(newData: Record<string, any>) {
        Object.assign(this.props, newData)
        this.render()
    }

    // Lifecycle methods
    onCreate() {
        console.log(`Component ${this.name} created`)
    }

    onMount() {
        console.log(`Component ${this.name} mounted`)
    }

    onDestroy() {
        console.log(`Component ${this.name} destroyed`)
    }

    onUpdate() {
        console.log(`Component ${this.name} updated`)
    }

    // Override render method for custom component rendering
    render() {
        this.onCreate()

        const element = super.render()
        element.innerHTML = this.template

        this.onMount()

        return element
    }
}

// Helper function for creating component
function createComponent(
    name: string,
    tag: keyof HTMLElementTagNameMap,
    props: Record<string, string> = {},
    template: string = '',
) {
    return new Component(name, tag, props, template)
}

export { Component, createComponent }
