import type { ApiKeyType, ApiResponseType, ApiRequestType } from "../type/api"
import type { App } from 'vue';
import { isAxiosError } from 'axios'
import { ElMessage } from "element-plus"
import jsSHA from "jssha"
import apiInfo from "../type/api"
import axios from './axios/axiosConfig'

const baseUrl = "https://ginnnnnn.top/api"

async function apiAccess<T extends ApiKeyType>(api: T): Promise<ApiResponseType[T]>
async function apiAccess<T extends ApiKeyType>(api: T, params: ApiRequestType[T]['params'], data: ApiRequestType[T]['data']): Promise<ApiResponseType[T]>

/** 函数重载 */
async function apiAccess<T extends ApiKeyType>(api: T, params?: ApiRequestType[T]['params'], data?: ApiRequestType[T]['data']) {
    /** 错误处理，主要catch 404，调用者不再需要try-catch */
    try {
        return await new Promise<ApiResponseType[T]>((resolve, reject) => {
            /** 查询参数转动态路由参数 */
            let url = apiInfo[api].url
            if (params) {
                for (const [key, val] of Object.entries(params)) {
                    const reg = RegExp(`(/):${key}(/)?`, 'g')
                    if (reg.test(url)) {
                        url = url.replaceAll(reg, `$1${val}$2`)
                        Reflect.deleteProperty(params, key)
                    }
                }
            }
            if (url.indexOf("http") != 0) {
                url = `${baseUrl}${url}`
            }
            /** 将对象转为json字符串 */
            if (data) {
                for (const [key, val] of Object.entries(data)) {
                    if (typeof val === 'object') {
                        Reflect.set(data, key, JSON.stringify(val))
                    }
                }
            }
            /** 设置token */
            let token = localStorage.getItem("Gins-token")
            if (!token) {
                token = new jsSHA("SHA-256", "TEXT")
                    .update(self.crypto.randomUUID())
                    .getHash("HEX")
                localStorage.setItem("Gins-token", token)
            }
            /** 异步发送请求 */
            axios<ApiResponseType[T]>({
                url: url,
                method: apiInfo[api].method,
                params: params || {},
                data: data || {},
                headers: apiInfo[api].token ? { 'Token': token } : {}
            }).then(res => {
                let message = "", success = false
                if (res.status !== 200 || !res.data) {
                    message = "请求出错"
                } else if (res.data.msg) {
                    message = res.data.msg
                    if (res.data.status === 200) {
                        success = true
                    }
                }
                if (message) {
                    ElMessage({ message, type: success ? "success" : "error" })
                }
                resolve(res.data)
            }).catch(error => {
                let message = error
                if (isAxiosError(error)) {
                    message = error.message
                }
                ElMessage({ message, type: "error" })
                reject(error)
            })
        })
    } catch {
        return {}
    }
}

export const useApiAccess = () => apiAccess

export default {
    install: (app: App) => {
        app.config.globalProperties.$apiAccess = apiAccess
    }
}