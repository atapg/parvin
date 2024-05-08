import parvinConfig from './configs/general'
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
    return template.replace(
        parvinConfig.templateVariableSyntaxRegex,
        (v, key) => {
            return data[key]
        },
    )
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
    //
}

export { render, renderTemplateStates, renderTemplateEvents, renderElements }
