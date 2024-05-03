import type IElementProps from './IElementProps'

export default interface IElement {
    type: string
    props: IElementProps
    children?: IElement[]
}
