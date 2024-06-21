import type { course, homework, notice, quiz, test } from "./mooc"

type RequestType = {
    params?: Object
    data?: Object
}

type Response<T = any> = {
    status: number
    data: T
    msg: string
}

export interface courseList extends Object {
    courseList: course[]
    totalPages: number
    currentPage: number
}

export interface courseDetail extends Object {
    course: course
    testList: test[]
}

export interface testDetail extends Object {
    course: course
    test: test
    questionList: quiz[] | homework[]
    totalPages: number
}

const apiInfo = {
    getCourseList: {
        url: "/mooc/course",
        method: "GET"
    },
    getCourseDetail: {
        url: "/mooc/course/:cid",
        method: "GET"
    },
    getTestDetail: {
        url: "/mooc/test/:tid",
        method: "GET"
    },
    getNotice: {
        url: "/mooc/notice/website",
        method: "GET"
    }
}

export type ApiKeyType = keyof typeof apiInfo

export interface ApiResponseType {
    getCourseList: Response<courseList>
    getCourseDetail: Response<courseDetail>
    getTestDetail: Response<testDetail>
    getNotice: Response<notice>
}

export interface ApiRequestType {
    getCourseList: RequestType & {
        params: {
            page?: number | string
            search?: string
            cid?: number | string
        }
    }
    getCourseDetail: RequestType & {
        params: { cid: number | string }
    }
    getTestDetail: RequestType & {
        params: {
            tid: number | string
            page: number | string
            search?: string
        }
    }
    getNotice: RequestType & {
        params: { version: string }
    }
}

export default apiInfo
