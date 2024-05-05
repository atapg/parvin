import { createElement, Element } from './element'
import type IParser from './interfaces/IParser'
import type IScript from './interfaces/IScript'

const parser = (data: string): IParser => {
    try {
        const templateMatch = data.match(/<template>([\s\S]+)<\/template>/)
        const scriptMatch = data.match(/<script>([\s\S]+)<\/script>/)

        if (!templateMatch || !scriptMatch) return { template: '', script: {} }

        const template = templateMatch[1].trim()
        const scriptContent = scriptMatch[1].trim()

        const start = scriptContent.indexOf('{')
        const end = scriptContent.lastIndexOf('}')
        if (start === -1 || end === -1) return { template: '', script: {} }

        const dataObjectStr = scriptContent.substring(start, end + 1)
        const dataObject: IScript = new Function(`return ${dataObjectStr}`)()

        return { template, script: dataObject }
    } catch (error) {
        console.error(error)
        return { template: '', script: {} }
    }
}

const setEvents = (
    element: Element,
    events: Record<string, string | null>[],
    methods: Object | undefined,
) => {
    events.forEach((event) => {
        // @ts-ignore
        element.addEvent(event.eventName, () => methods[event.eventFunction]())
    })
}

const eventParser = (
    node: HTMLElement,
    element: Element,
    methods: Object | undefined,
) => {
    const events: Record<string, string | null>[] = []
    // console.log(node)
    node.getAttributeNames().forEach((event) => {
        events.push({
            eventName: event.replace('@', ''),
            eventFunction: node.getAttribute(event),
        })
    })

    setEvents(element, events, methods)
}

const elementParser = (template: string, methods: Object | undefined) => {
    const events: any = {}

    const parser = new DOMParser()
    const doc = parser.parseFromString(template, 'text/html')
    const rootElement = doc.body.firstChild

    const createChildElements = (
        childNodes: ChildNode,
        parentElement: Element,
    ) => {
        // @ts-ignore
        for (const childNode of childNodes) {
            if (childNode instanceof HTMLElement) {
                const element = createElement(
                    // @ts-ignore
                    childNode.tagName
                        ? childNode.tagName.toLocaleLowerCase()
                        : 'div',
                    {},
                    [],
                )

                eventParser(childNode, element, methods)
                // @ts-ignore
                parentElement.appendChild(element)
                // instanceof Text
                // @ts-ignore
                for (const cn of childNode.childNodes) {
                    if (cn instanceof Text && childNode === cn.parentNode) {
                        element.appendChild(cn.data)
                    }
                }

                if (childNode.childNodes.length) {
                    // @ts-ignore
                    createChildElements(childNode.childNodes, element)
                }
            }
        }
    }

    if (rootElement instanceof HTMLElement) {
        const element = createElement(
            // @ts-ignore
            rootElement.tagName.toLocaleLowerCase(),
            {},
            [],
        )
        eventParser(rootElement, element, methods)
        // @ts-ignore
        for (const cn of rootElement.childNodes) {
            if (cn instanceof Text && cn.parentNode === rootElement) {
                element.appendChild(cn.data)
            }
        }

        // @ts-ignore
        createChildElements(rootElement.childNodes, element)

        return element
    }

    return null
}

export { parser, elementParser }
