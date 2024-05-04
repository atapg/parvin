import type IScript from './IScript'

export default interface IParser {
    template: string | null
    script: IScript
}
