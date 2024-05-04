import { generateToken } from './utils/helpers'

class Element {
    tag
    attributes
    children
    parent: null | Element
    token

    constructor(tag: string, attributes = {}, children: Array<Element> = []) {
        this.tag = tag
        this.attributes = attributes
        this.children = children
        this.parent = null

        // For future use
        this.token = generateToken()
    }

    // Appending child to the element
    appendChild(child: Element) {
        child.parent = this
        this.children.push(child)
    }

    // Recursive render function to show elements in the DOM
    render() {
        const element = document.createElement(this.tag)

        for (const [key, value] of Object.entries(this.attributes)) {
            // @ts-ignore
            element.setAttribute(key, value)
        }

        // Set parvin id
        element.setAttribute('parvin_token', this.token)

        this.children.forEach((child) => {
            if (child instanceof Element) {
                const childElement = child.render()
                element.appendChild(childElement)
            } else {
                element.appendChild(document.createTextNode(child))
            }
        })

        return element
    }
}

// Helper function
function createElement(tag: string, attributes = {}, children = []) {
    const element = new Element(tag, attributes, children)

    return element
}

export { Element, createElement }
