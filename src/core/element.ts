import { Component } from './component'
import type IElementEvents from './interfaces/IElementEvents'
import { generateToken } from './utils/helpers'

class Element {
    tag: keyof HTMLElementTagNameMap
    props: Record<string, string>
    children: Array<Component | Element | string>
    declare parent: Element | Component
    id: string
    declare DOMElement: HTMLElement
    element: Element
    events: IElementEvents[] = []
    show: boolean = true
    condition: boolean = true
    declare innerText: string

    constructor(
        tag: keyof HTMLElementTagNameMap,
        props: Record<string, string> = {},
        children: Array<Component | Element | string> = [],
    ) {
        this.tag = tag
        this.props = props
        this.children = children
        this.element = this
        this.DOMElement = document.createElement(this.tag)

        // For future use
        this.id = generateToken()
    }

    // Appending child to the element
    appendChild(child: Component | Element | string) {
        if (typeof child !== 'string') {
            child.parent = this
        }

        // @ts-ignore
        this.children.push(child)

        this.rerender()
    }

    removeChild(child: Component | Element) {
        const index = this.children.indexOf(child)

        this.children.splice(index, 1)

        this.rerender()

        if (child instanceof Component) {
            child.onDestroyed()
        }
    }

    addEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ) {
        this.events.push({
            eventType,
            listener,
            options,
        })

        this.DOMElement.addEventListener(eventType, listener, options)
    }

    removeEvent(
        eventType: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ) {
        // TODO remove event from event array
        this.DOMElement.removeEventListener(eventType, listener, options)
    }

    getElementInstance() {
        return this
    }

    getParentElement() {
        return this.parent
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

    setCondition(v: boolean) {
        this.condition = v
        this.rerender()
    }

    // Recursive render function to show elements in the DOM
    render() {
        // console.log('renders')
        for (const [key, value] of Object.entries(this.props)) {
            // @ts-ignore
            this.DOMElement.setAttribute(key, value)
        }

        // Set parvin id
        // this.DOMElement.setAttribute('prv', this.id)

        // Remove all children
        this.DOMElement.innerHTML = ''

        this.children.forEach((child) => {
            if (child instanceof Element) {
                child.render()
                const childElement = child.DOMElement
                if (child.condition) {
                    this.DOMElement.appendChild(childElement)
                }
            } else {
                this.DOMElement.appendChild(document.createTextNode(child))
            }
        })

        // Set events
        this.events.forEach(({ eventType, listener, options }) => {
            this.addEvent(eventType, listener, options)
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
