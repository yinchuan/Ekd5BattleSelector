/*
    this file has helper functions that are not related to the game logic
*/
const iconv = require('iconv-lite')

// write Chinese string to buffer
export const writeMsg = (view, position, msg) => {
    const encoded = iconv.encode(msg, 'gb18030')
    for (let i = 0; i < encoded.length; i++) {
        view.setUint8(position + i, encoded[i])
    }
    view.setUint8(position + encoded.length, 0x00) // terminate
}

export const downloadFile = (name, buffer) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
}
