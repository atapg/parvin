import { Element } from './element'
import type IGlobalObject from './interfaces/IGlobalObject'
import { elementParser, parser } from './parser'
import { renderTemplateStates } from './renderer'
import { State } from './state'

class Component extends Element {
    name
    template
    script
    state: State | null
    methods: Object
    watchers: Object | undefined
    declare globalObject: IGlobalObject
    declare DOMElement: HTMLElement
    mounted = false
    created = false

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
        this.template = data.template

        this.script = data.script

        this.state = new State(this.script.state ? this.script.state : {}, this)
        this.methods = this.script.methods
        this.watchers = this.script?.watchers

        this.globalObject = { ...this.methods, ...this.state }
    }

    onStateUpdate(oldValue: any, newValue: any, property: any) {
        if (this.state) {
            // @ts-ignore
            if (this.watchers[property]) {
                // @ts-ignore
                this.watchers[property].call(
                    this.globalObject,
                    oldValue,
                    newValue,
                    property,
                )
            }

            this.rerender()
        }
    }

    // Lifecycle methods
    onCreated() {
        if (this.script?.onCreated) {
            this.script?.onCreated.call(this.globalObject)
        }
    }

    onMounted() {
        if (this.script?.onMounted) {
            this.script?.onMounted.call(this.globalObject)
        }
    }

    onDestroyed() {
        if (this.script?.onDestroyed) {
            this.script?.onDestroyed.call(this.globalObject)
        }
    }

    onUpdated() {
        if (this.script?.onUpdated) {
            this.script?.onUpdated.call(this.globalObject)
        }
    }

    rerender() {
        super.rerender()
        this.onUpdated()
    }

    destroy(): void {
        super.destroy()
        this.onDestroyed()
    }

    // Override render method for custom component rendering
    render() {
        if (!this.created) {
            this.onCreated()
            this.created = true
        }

        this.DOMElement = super.render()

        if (this.template) {
            const renderedStates = renderTemplateStates(
                this.template,
                this.state ? this.state.state : {},
            )

            const elements = elementParser(
                renderedStates,
                this.globalObject,
                this.state,
            )

            if (elements) {
                this.DOMElement.appendChild(elements.render())
            }
        }

        if (!this.mounted) {
            this.onMounted()
            this.mounted = true
        }

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
