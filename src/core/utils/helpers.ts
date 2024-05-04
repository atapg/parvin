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
