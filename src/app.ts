import { createComponent } from './core/component'
import { createElement } from './core/element'
import { render } from './core/renderer'

const Parvin = {
    createElement: createElement,
    createComponent: createComponent,
    render: render,
}

// @ts-ignore
window.Parvin = Parvin
