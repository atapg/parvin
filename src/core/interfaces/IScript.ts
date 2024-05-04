export default interface IScript {
    state?: Object
    onCreated?: Function
    onMounted?: Function
    onUpdated?: Function
    onDestroyed?: Function
}
