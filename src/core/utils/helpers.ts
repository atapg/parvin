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

export function findKeyByValue(
    obj: Record<string, any>,
    searchValue: any,
): string | undefined {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const innerObj = obj[key]
            for (const innerKey in innerObj) {
                if (innerObj[innerKey] === searchValue) {
                    return key
                }
            }
        }
    }
    return undefined // Return undefined if the value is not found
}

export function findKeyByNestedValue(
    obj: Record<string, any>,
    searchValue: any,
): string | undefined {
    if (!obj || typeof obj !== 'object') {
        return undefined
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (deepValueMatch(obj[key], searchValue)) {
                return key
            }
        }
    }
    return undefined // Return undefined if the nested value is not found
}

function deepValueMatch(value: any, searchValue: any): boolean {
    if (Array.isArray(value)) {
        return Array.isArray(searchValue) && arraysEqual(value, searchValue)
    }

    if (typeof value === 'object' && value !== null) {
        return (
            typeof searchValue === 'object' &&
            searchValue !== null &&
            objectsEqual(value, searchValue)
        )
    }

    return value === searchValue
}

function arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
}

function objectsEqual(
    obj1: Record<string, any>,
    obj2: Record<string, any>,
): boolean {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    }
    for (const key of keys1) {
        if (!deepValueMatch(obj1[key], obj2[key])) {
            return false
        }
    }
    return true
}

export function convertProxyToRegular(proxy: any) {
    const regular: any = {}
    for (const key in proxy) {
        if (Array.isArray(proxy[key])) {
            regular[key] = [...proxy[key]] // Copy arrays
        } else if (typeof proxy[key] === 'object' && proxy[key] !== null) {
            regular[key] = convertProxyToRegular(proxy[key]) // Recursively convert nested objects
        } else {
            regular[key] = proxy[key]
        }
    }
    return regular
}
