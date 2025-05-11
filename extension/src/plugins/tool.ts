const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('')
        }, ms)
    })
}

const waitFor = async (checker: any) => {
    return new Promise((resolve) => {
        const checkDisplay = setInterval(() => {
            console.log('check wait for')
            if (checker()) {
                clearInterval(checkDisplay);
                resolve('');
            }
        }, 50);
    });
}

const getUrlParam = (key: string) => {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    const result = window.location.search.substring(1).match(reg)
        || window.location.hash.substring((window.location.hash.search(/\?/)) + 1).match(reg)
    return result ? decodeURIComponent(result[2]) : null
}

const randomString = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

export { sleep, getUrlParam, randomString, waitFor }