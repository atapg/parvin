class State {
    data: Record<string, any>
    listeners: Record<string, Function[]>

    constructor(data: Record<string, any>) {
        this.data = data
        this.listeners = {}
    }

    // Getter to access data properties
    get(key: string) {
        return this.data[key]
    }

    // Setter to update data properties and trigger listeners
    set(key: string, value: any) {
        this.data[key] = value
        if (this.listeners[key]) {
            this.listeners[key].forEach((listener) => listener(value))
        }
    }

    // Method to subscribe to data changes
    subscribe(key: string, listener: Function) {
        if (!this.listeners[key]) {
            this.listeners[key] = []
        }
        this.listeners[key].push(listener)
    }
}

export { State }
