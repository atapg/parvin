import { Element } from './element'
import { parser } from './parser'

class Component extends Element {
    name
    template
    script

    constructor(
        name: string,
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        template: string = '',
    ) {
        super(tag, props, [])
        this.name = name
        this.template = parser(template)?.template
        this.script = parser(template)?.script
        this.setBindings()
    }

    setBindings() {
        // console.log()
    }

    // Update data method
    updateData(newData: Record<string, any>) {
        Object.assign(this.props, newData)
        this.render()
    }

    // Lifecycle methods
    onCreate() {
        if (this.script?.onCreated) {
            this.script?.onCreated()
        }
    }

    onMount() {
        if (this.script?.onMounted) {
            this.script?.onMounted()
        }
    }

    onDestroy() {
        if (this.script?.onDestroyed) {
            this.script?.onDestroyed()
        }
    }

    onUpdate() {
        if (this.script?.onUpdated) {
            this.script?.onUpdated()
        }
    }

    // Override render method for custom component rendering
    render() {
        this.onCreate()

        const element = super.render()

        if (this.template) {
            element.innerHTML = this.template
        }

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
