import { Element } from './element'
import { elementParser, parser } from './parser'
import {
    renderElements,
    renderTemplateEvents,
    renderTemplateStates,
} from './renderer'
import { State } from './state'

class Component extends Element {
    name
    template
    script
    state: State | null
    methods: Object | undefined
    object: Object
    declare DOMElement: HTMLElement

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

        this.state = new State(this.script.state ? this.script.state : {}, this)
        this.methods = this.script?.methods

        // @ts-ignore
        this.object = { ...this.methods, ...this.state }
    }

    onStateUpdate() {
        if (this.state) {
            // this.state.update(newState)
            this.rerender()
            this.onUpdated()
        }
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

    rerender() {
        super.rerender()
    }

    // Override render method for custom component rendering
    render() {
        this.onCreated()

        this.DOMElement = super.render()

        if (this.template) {
            const renderedStates = renderTemplateStates(
                this.template,
                this.state ? this.state.state : {},
            )

            // @ts-ignore
            const elements = elementParser(renderedStates, this.object)

            if (elements) {
                this.DOMElement.appendChild(elements.render())
            }
        }

        this.onMounted()

        return this.DOMElement
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
