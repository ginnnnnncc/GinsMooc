import type { course, homework, quiz, test } from "./mooc"

type RequestType = {
    params?: Object
    data?: Object
}

type Response<T = any> = {
    status: number
    data: T
    msg: string
}

interface courseDetail extends Object {
    course: course
    testList: test[]
}

interface testDetail extends Object {
    course: course
    test: test
    questionList: quiz[] | homework[]
    totalPages: number
}

const apiInfo = {
    getCourseList: {
        url: "/mooc/course",
        method: "GET",
        token: false
    },
    addCourse: {
        url: "/mooc/course/:cid",
        method: "POST",
        token: true
    },
    getCourseDetail: {
        url: "/mooc/course/:cid",
        method: "GET",
        token: false
    },
    getTestDetail: {
        url: "/mooc/test/:tid",
        method: "GET",
        token: false
    }
}

export type ApiKeyType = keyof typeof apiInfo

export interface ApiResponseType {
    getCourseList: Response<{
        courseList: course[]
        totalPages: number
    }>
    addCourse: Response<{
        finished: number
        total: number
    }>
    getCourseDetail: Response<courseDetail>
    getTestDetail: Response<testDetail>
}

export interface ApiRequestType {
    getCourseList: RequestType & {
        params: {
            page: number | string
            search?: string
        }
    }
    addCourse: RequestType & {
        params: { cid: number | string }
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
}

export default apiInfo
