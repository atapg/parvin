import { Element } from './element'

class Component extends Element {
    name

    constructor(
        name: string,
        tag: keyof HTMLElementTagNameMap,
        attributes: Record<string, string> = {},
        children: Array<Element> = [],
    ) {
        super(tag, attributes, children)
        this.name = name
    }

    // Update data method
    updateData(newData: Record<string, any>) {
        Object.assign(this.attributes, newData)
        this.render()
    }

    // Override render method for custom component rendering
    render() {
        const element = super.render()

        return element
    }
}

// Helper function for creating component
function createComponent(
    name: string,
    tag: keyof HTMLElementTagNameMap,
    attributes: Record<string, string> = {},
    children: Array<Element> = [],
) {
    return new Component(name, tag, attributes, children)
}

export { Component, createComponent }
