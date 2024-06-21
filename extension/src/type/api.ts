import type { homework, quiz, notice } from "./mooc"

type RequestType = {
    params?: Object
    data?: Object
}

type Response<T = any> = {
    status: number
    data: T
    msg: string
}

const apiInfo = {
    checkTestExist: {
        url: "/mooc/test/:tid",
        method: "GET"
    },
    selectQustion: {
        url: "/mooc/test/:tid",
        method: "POST"
    },
    getAnnouncement: {
        url: "/mooc/announcement",
        method: "GET"
    },
    getNewExamInfo: {
        url: "https://www.icourse163.org/mm-tiku/web/j/mocExamBean.getPaper.rpc",
        method: "POST"
    },
    getNotice: {
        url: "/mooc/notice/extension",
        method: "GET"
    }
}

export type ApiKeyType = keyof typeof apiInfo

export interface ApiResponseType {
    checkTestExist: Response<{
        existing: boolean
    }>
    selectQustion: Response<{
        choiceAns?: number[]
        completionAns?: Object
        homeworkAns?: Object
    }>
    getAnnouncement: Response<string>
    getNotice: Response<notice>
    getNewExamInfo: {
        code: number
        result: {
            tid: number
            questions: { optionDtos: { id: number }[] }[]
        }
    }
}

export interface ApiRequestType {
    checkTestExist: RequestType & {
        params: { tid: number | string; type: "isExisting" }
    }
    selectQustion: RequestType & {
        params: { tid: number | string }
        data: {
            oidList?: number[]
            titleList?: string[]
        }
    }
    getNotice: RequestType & {
        params: { version: string }
    }
    getNewExamInfo: RequestType & {
        params: { csrfKey: string }
        data: {
            answerformId: number | string
            examId: number | string
        }
    }
}

export default apiInfo
