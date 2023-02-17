import jsSHA from "jssha"

const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('')
        }, ms)
    })
}

const getUrlParam = (key: string) => {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    const result = window.location.search.substring(1).match(reg)
        || window.location.hash.substring((window.location.hash.search(/\?/)) + 1).match(reg)
    return result ? decodeURIComponent(result[2]) : null
}

const randomString = (length: number) => {
    return new jsSHA("SHA-256", "TEXT")
        .update(self.crypto.randomUUID())
        .getHash("HEX").substring(0, length)
}

export { sleep, getUrlParam, randomString }