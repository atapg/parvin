import { Element } from './element'

class Component extends Element {
    name

    constructor(
        name: string,
        tag: string,
        attributes = {},
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

        // Add custom behavior or event listeners to the rendered component
        element.addEventListener('click', () => {
            console.log('Component clicked!')
        })

        return element
    }
}

// Helper function for creating component
function createComponent(
    name: string,
    tag: string,
    attributes = {},
    children = [],
) {
    return new Component(name, tag, attributes, children)
}

export { Component, createComponent }
