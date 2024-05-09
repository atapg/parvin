import parvinConfig from './configs/general'
import { createElement, Element } from './element'
import type IParser from './interfaces/IParser'
import type IScript from './interfaces/IScript'
import { getDomElementsAttributes } from './utils/dom'

const parser = (data: string): IParser => {
    let script: IScript = {
        methods: {},
        watchers: {},
    }
    let template = ''

    try {
        const templateMatch = data.match(/<template>([\s\S]+)<\/template>/)
        const scriptMatch = data.match(/<script>([\s\S]+)<\/script>/)

        if (templateMatch) {
            template = templateMatch[1].trim()
        }

        let scriptContent = '{}'
        let dataObjectStr = ''

        if (scriptMatch) {
            scriptContent = scriptMatch[1].trim()
            const start = scriptContent.indexOf('{')
            const end = scriptContent.lastIndexOf('}')
            if (start === -1 || end === -1) return { template, script }
            dataObjectStr = scriptContent.substring(start, end + 1)
        }

        if (dataObjectStr) {
            script = new Function(`return ${dataObjectStr}`)()
        }

        if (!script.hasOwnProperty('methods')) {
            script.methods = {}
        }

        if (!script.hasOwnProperty('watchers')) {
            script.watchers = {}
        }

        return { template, script }
    } catch (error) {
        console.error(error)
        return { template, script }
    }
}

const setEvents = (
    element: Element,
    events: Record<string, string | null>[],
    methods: Object | undefined,
) => {
    events.forEach((event) => {
        // @ts-ignore
        if (!methods[event.eventFunction]) {
            console.error(`'${event.eventFunction}' function not declared`)
        }

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
        if (event.startsWith(parvinConfig.templateEventSyntax)) {
            events.push({
                eventName: event.replace(parvinConfig.templateEventSyntax, ''),
                eventFunction: node.getAttribute(event),
            })
        }
    })
    setEvents(element, events, methods)
}

const elementParser = (template: string, methods: Object | undefined) => {
    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(template, 'text/html')

        let rootCount = 0
        let rootElement

        // @ts-ignore
        for (const childNode of doc.body.childNodes) {
            if (childNode instanceof HTMLElement) {
                rootCount++
            }
        }

        if (rootCount > 1) {
            console.error('Component must have one root element')
            return
        }

        rootElement = doc.body.firstChild

        const createChildElements = (
            childNodes: NodeListOf<ChildNode>,
            parentElement: Element,
        ) => {
            // @ts-ignore
            for (const childNode of childNodes) {
                if (childNode instanceof HTMLElement) {
                    const attrs = getDomElementsAttributes(childNode)

                    const element = createElement(
                        // @ts-ignore
                        childNode.tagName
                            ? childNode.tagName.toLocaleLowerCase()
                            : 'div',
                        attrs,
                        [],
                    )

                    eventParser(childNode, element, methods)

                    parentElement.appendChild(element)
                    // instanceof Text
                    // @ts-ignore
                    for (const cn of childNode.childNodes) {
                        if (cn instanceof Text && childNode === cn.parentNode) {
                            element.appendChild(cn.data)
                        }
                    }

                    if (childNode.childNodes.length) {
                        createChildElements(childNode.childNodes, element)
                    }
                }
            }
        }

        if (rootElement instanceof HTMLElement) {
            const attrs = getDomElementsAttributes(rootElement)

            const element = createElement(
                // @ts-ignore
                rootElement.tagName.toLocaleLowerCase(),
                attrs,
                [],
            )

            eventParser(rootElement, element, methods)

            // @ts-ignore
            for (const cn of rootElement.childNodes) {
                if (cn instanceof Text && cn.parentNode === rootElement) {
                    element.appendChild(cn.data)
                }
            }

            createChildElements(rootElement.childNodes, element)

            return element
        }
    } catch (error) {
        console.error(error)
    }
    return null
}

export { parser, elementParser }
