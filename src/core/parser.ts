import parvinConfig from './configs/general'
import { createElement, Element } from './element'
import type IParser from './interfaces/IParser'
import type IScript from './interfaces/IScript'
import type { State } from './state'
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

const elementParser = (
    template: string,
    methods: Object | undefined,
    state: State | null,
) => {
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

                    parentElement.appendChild(element)

                    templateEngineParser(childNode, element, methods, state)
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

            templateEngineParser(rootElement, element, methods, state)

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

const templateEngineParser = (
    node: HTMLElement,
    element: Element,
    methods: Object | undefined,
    state: State | null,
) => {
    const events = getElementEvents(node)

    // Handle elements events
    setEvents(element, events, methods)

    // Handle elements conditonal renderings
    checkConditionalRenders(element, events, methods, state)

    // Handle input binding
    checkInputBinding(element, events, state)
}

const getElementEvents = (node: HTMLElement) => {
    const events: Record<string, string | null>[] = []

    // console.log(node)
    node.getAttributeNames().forEach((event) => {
        if (event.startsWith(parvinConfig.templateEventSyntax)) {
            const eventType = event.replace(
                parvinConfig.templateEventSyntax,
                '',
            )
            events.push({
                type: eventType,
                name: node.getAttribute(event),
            })
        }
    })

    return events
}

const setEvents = (
    element: Element,
    events: Record<string, string | null>[],
    methods: Object | undefined,
) => {
    const conditions = getConditions()
    events.forEach((event) => {
        if (event.type) {
            if (conditions.indexOf(event.type) === -1) {
                // @ts-ignore
                if (!methods[event.name]) {
                    console.error(`'${event.name}' function not declared`)
                }
                // @ts-ignore
                element.addEvent(event.type, () => methods[event.name]())
            }
        }
    })
}

const checkConditionalRenders = (
    element: Element,
    attributes: Record<string, string | null>[],
    methods: Object | undefined,
    state: State | null,
) => {
    const conditions = getConditions()

    // Check if it has any attributes
    if (attributes.length) {
        // Check each attribute
        attributes.forEach((attr) => {
            // Check attribute type
            if (attr.type) {
                // Check if attribute is conditional attribute
                if (conditions.indexOf(attr.type) >= 0) {
                    // Check if we have state
                    if (state) {
                        // Check if attribute type is type of "IF"
                        if (attr.type === parvinConfig.ifConditionName) {
                            // Check if we got attribute value
                            if (attr.name) {
                                const data = state.state[attr.name]

                                element.setCondition(!!data)

                                if (typeof data === 'undefined') {
                                    console.error(`${attr.name} is undefined`)
                                }
                            }
                        } else if (
                            attr.type === parvinConfig.elseIfConditionName
                        ) {
                        } else if (
                            attr.type === parvinConfig.elseConditionName
                        ) {
                            const elementIndex =
                                element.parent.children.indexOf(element)
                            const prevElementIndex =
                                element.parent.children[elementIndex - 1]

                            if (prevElementIndex instanceof Element) {
                                element.setCondition(
                                    !prevElementIndex.condition,
                                )
                            }
                            //
                            //
                            // const data = state.state[attr.name]
                            // if (data) {
                            //     element.setCondition(data)
                            // } else {
                            //     console.error(`${attr.name} is undefined`)
                            //     element.setCondition(false)
                            // }
                        }
                    }
                }
            }
        })
    }
}

const getConditions = () => {
    return [
        parvinConfig.ifConditionName,
        parvinConfig.elseIfConditionName,
        parvinConfig.elseConditionName,
    ]
}

const checkInputBinding = (
    element: Element,
    attributes: Record<string, string | null>[],
    state: State | null,
) => {
    if (element.tag === 'input') {
        attributes.forEach((attr) => {
            if (attr.type === parvinConfig.templateModelBindingSyntax) {
                if (state) {
                    if (attr.name) {
                        element.addEvent(
                            'input',
                            // @ts-ignore
                            (e) => (state.state[attr.name] = e.target.value),
                        )
                    }
                }
            }
        })
    }
}

export { parser, elementParser }
