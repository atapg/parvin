import { createElement } from './element'
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

            // if (typeof childNode.data === 'string' && childNode.data) {
            //     if (element) {
            //         console.log(childNode.data)
            //         element.appendChild(childNode.data)
            //     }
            // }
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

export { parser, elementParser }
