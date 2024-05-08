import { Component } from './component'
import { generateToken } from './utils/helpers'

class Element {
    tag: keyof HTMLElementTagNameMap
    props: Record<string, string>
    children: Array<Component | Element | string>
    parent: Element | null
    token: string
    declare DOMElement: HTMLElement
    element: Element

    constructor(
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        children: Array<Component | Element | string> = [],
    ) {
        this.tag = tag
        this.props = props
        this.children = children
        this.element = this
        this.parent = null
        this.DOMElement = document.createElement(this.tag)

        // For future use
        this.token = generateToken()
    }

    // Appending child to the element
    appendChild(child: Component | Element | string) {
        if (child instanceof Element) {
            child.parent = this
        }

        // @ts-ignore
        this.children.push(child)

        this.rerender()
    }

    addEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ) {
        this.DOMElement.addEventListener(eventType, listener, options)
    }

    removeEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ) {
        this.DOMElement.removeEventListener(eventType, listener, options)
    }

    getElementInstance() {
        return this
    }

    rerender() {
        if (this.DOMElement) {
            const oldElement = this.DOMElement
            this.DOMElement = document.createElement(this.tag)
            this.render()
            oldElement.replaceWith(this.DOMElement)
        }
    }

    destroy() {
        this.DOMElement.remove()
    }

    // Recursive render function to show elements in the DOM
    render() {
        // console.log('renders')
        for (const [key, value] of Object.entries(this.props)) {
            // @ts-ignore
            this.DOMElement.setAttribute(key, value)
        }

        // Set parvin id
        this.DOMElement.setAttribute('parvin_token', this.token)

        // Remove all children
        this.DOMElement.innerHTML = ''

        this.children.forEach((child) => {
            if (child instanceof Element) {
                const childElement = child.render()
                this.DOMElement.appendChild(childElement)
            } else {
                this.DOMElement.appendChild(document.createTextNode(child))
            }
        })

        return this.DOMElement
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
