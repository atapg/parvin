import type { Element } from './element'

function render(vDomElement: Element, container: HTMLElement) {
    const domElement = vDomElement.render()
    container.appendChild(domElement)
}

export { render }
