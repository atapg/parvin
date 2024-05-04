export const generateToken = (length = 10) => {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyz'.split('')
    if (typeof length !== 'number') {
        length = Math.floor(Math.random() * chars.length)
    }
    var str = ''
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}

export const getTemplateEvents = (template: string) => {
    const events: any = {}

    const eventRegex = /@(\w+)/g

    const matches = template.matchAll(eventRegex)

    for (const match of matches) {
        const fullMatch = match[0]
        const eventName = match[1]

        const functionRegex = new RegExp(
            `${fullMatch}\\s*=\\s*['"](.+?)['"]`,
            'g',
        )
        const functionMatch = functionRegex.exec(template)
        const functionName = functionMatch ? functionMatch[1] : ''

        events[eventName] = functionName
    }

    return events
}

export const setTokens = (template: string) => {
    const parser = new DOMParser()

    // Parse the HTML string
    const doc = parser.parseFromString(template, 'text/html')

    // Get the root element from the parsed document
    // @ts-ignore
    const rootElement: HTMLElement | null = doc.body.firstChild

    // Add attributes to all elements within the root element
    if (rootElement) {
        rootElement.setAttribute('parvin_token', generateToken())

        rootElement.querySelectorAll('*').forEach((element) => {
            element.setAttribute('parvin_token', generateToken())
        })

        return rootElement.outerHTML
    }

    return template
}
