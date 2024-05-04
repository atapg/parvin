import type IParser from './interfaces/IParser'
import type IScript from './interfaces/IScript'

const parser = (data: string): IParser | null => {
    try {
        const templateMatch = data.match(/<template>([\s\S]+)<\/template>/)
        const scriptMatch = data.match(/<script>([\s\S]+)<\/script>/)

        if (!templateMatch || !scriptMatch) return null

        const template = templateMatch[1].trim()
        const scriptContent = scriptMatch[1].trim()

        const start = scriptContent.indexOf('{')
        const end = scriptContent.lastIndexOf('}')
        if (start === -1 || end === -1) return null

        const dataObjectStr = scriptContent.substring(start, end + 1)
        const dataObject: IScript = new Function(`return ${dataObjectStr}`)()

        return { template, script: dataObject }
    } catch (error) {
        console.error(error)
        return null
    }
}

export { parser }
