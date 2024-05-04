import { generateToken } from './utils/helpers'

class Element {
    tag: keyof HTMLElementTagNameMap
    props: Record<string, string>
    children: Element[]
    parent: Element | null
    token: string
    element: HTMLElement

    constructor(
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        children: Array<Element> = [],
    ) {
        this.tag = tag
        this.props = props
        this.children = children
        this.parent = null
        this.element = document.createElement(tag)

        // For future use
        this.token = generateToken()
    }

    // Appending child to the element
    appendChild(child: Element) {
        child.parent = this
        this.children.push(child)
    }

    addEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ) {
        this.element.addEventListener(eventType, listener, options)
    }

    removeEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ) {
        this.element.removeEventListener(eventType, listener, options)
    }

    // Recursive render function to show elements in the DOM
    render() {
        for (const [key, value] of Object.entries(this.props)) {
            // @ts-ignore
            this.element.setAttribute(key, value)
        }

        // Set parvin id
        this.element.setAttribute('parvin_token', this.token)

        this.children.forEach((child) => {
            if (child instanceof Element) {
                const childElement = child.render()
                this.element.appendChild(childElement)
            } else {
                this.element.appendChild(document.createTextNode(child))
            }
        })

        return this.element
    }
}

// Helper function
function createElement(
    tag: keyof HTMLElementTagNameMap,
    attributes = {},
    children = [],
) {
    const element = new Element(tag, attributes, children)

    return element
}

export { Element, createElement }
