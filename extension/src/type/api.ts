import type { homework, quiz } from "./mooc"

type RequestType = {
    params?: Object,
    data?: Object
}

type Response<T = any> = {
    status: number,
    data: T,
    msg: string
}

const apiInfo = {
    'checkTestExist': {
        url: '/mooc/api/test/:tid',
        method: 'GET',
        token: false
    },
    'addCourse': {
        url: '/mooc/api/course/:cid',
        method: 'POST',
        token: true
    },
    'selectQustion': {
        url: '/mooc/api/test/:tid',
        method: 'POST',
        token: false
    },
    'getAnnouncement': {
        url: '/mooc/api/announcement',
        method: 'GET',
        token: false
    }
}

export type ApiKeyType = keyof typeof apiInfo

export interface ApiResponseType {
    'checkTestExist': Response<{
        existing: boolean
    }>,
    'addCourse': Response<{
        finished: number,
        total: number
    }>,
    'selectQustion': Response<{
        choiceAns?: Object,
        completionAns?: Object,
        homeworkAns?: Object
    }>,
    'getAnnouncement': Response<string>
}

export interface ApiRequestType {
    'checkTestExist': RequestType & {
        params: { tid: number | string, type: "isExisting" }
    },
    'addCourse': RequestType & {
        params: { cid: number | string }
    },
    'selectQustion': RequestType & {
        params: { tid: number | string },
        data: {
            qidList?: number[],
            titleList?: string[]
        }
    },
    'getAnnouncement': RequestType
}

export default apiInfo