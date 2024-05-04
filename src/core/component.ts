import { Element } from './element'
import { parser } from './parser'
import { renderTemplate } from './renderer'
import { State } from './state'

class Component extends Element {
    name
    template
    script
    state: State | null

    constructor(
        name: string,
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        template: string = '',
    ) {
        super(tag, props, [])
        this.name = name

        // Parse data and seperate template and scripts
        const data = parser(template)
        this.template = data?.template
        this.script = data?.script

        this.state = this.script?.state ? new State(this.script.state) : null
    }

    onStateUpdate(newState: Record<string, any>) {
        if (this.state) {
            // this.state.update(newState)
            this.render()
        }
    }

    // Update data method
    updateData(newData: Record<string, any>) {
        Object.assign(this.props, newData)
        this.render()
    }

    // Lifecycle methods
    onCreated() {
        if (this.script?.onCreated) {
            this.script?.onCreated()
        }
    }

    onMounted() {
        if (this.script?.onMounted) {
            this.script?.onMounted()
        }
    }

    onDestroyed() {
        if (this.script?.onDestroyed) {
            this.script?.onDestroyed()
        }
    }

    onUpdated() {
        if (this.script?.onUpdated) {
            this.script?.onUpdated()
        }
    }

    // Override render method for custom component rendering
    render() {
        this.onCreated()

        const element = super.render()

        if (this.template) {
            element.innerHTML = renderTemplate(
                this.template,
                this.state ? this.state.data : {},
            )
        }

        this.onMounted()

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
