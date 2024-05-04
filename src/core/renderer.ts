import { createElement, type Element } from './element'
import { getTemplateEvents, setTokens } from './utils/helpers'

// Render application in the DOM
function render(vDomElement: Element, container: HTMLElement) {
    const domElement = vDomElement.render()
    container.appendChild(domElement)
}

// function renderTemplate(template: string) {
//     return template
// }

// Set state value instead of $$variables in the template
function renderTemplateStates(template: string, data: Record<string, any>) {
    return template.replace(/\$\$([\w.]+)/g, (v, key) => {
        return data[key]
    })
}

function renderTemplateEvents(template: string, methods: Object | undefined) {
    const events: any = {}

    const parser = new DOMParser()
    const doc = parser.parseFromString(template, 'text/html')
    const rootElement = doc.body.firstChild

    console.log(rootElement?.childNodes)

    return template
}

function renderElements(template: string, methods: Object | undefined) {
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
                // console.log('creting')
                // createChildElements(childNodes)

                const children = childNode.firstElementChild
                    ? []
                    : [childNode.innerHTML]

                const element = createElement(
                    // @ts-ignore
                    childNode.tagName.toLocaleLowerCase(),
                    {},
                    children,
                )

                parentElement.appendChild(element)

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

        // const appendChildToElement = (ele:)

        // @ts-ignore
        createChildElements(rootElement.childNodes, element)

        // console.log({ rootElement })

        return element
    }

    return null
}

export { render, renderTemplateStates, renderTemplateEvents, renderElements }
