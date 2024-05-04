import type { Element } from './element'

function render(vDomElement: Element, container: HTMLElement) {
    const domElement = vDomElement.render()
    container.appendChild(domElement)
}

function renderTemplate(template: string, data: Record<string, any>) {
    return template.replace(/\$\$([\w.]+)/g, (v, key) => {
        return data[key]
    })
}

export { render, renderTemplate }
