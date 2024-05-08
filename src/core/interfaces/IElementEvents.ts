export default interface IElementEvents {
    eventType: string
    listener: EventListenerOrEventListenerObject
    options?: boolean | AddEventListenerOptions
}
