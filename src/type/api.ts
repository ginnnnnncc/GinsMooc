import type { course, homework, quiz, test } from "./mooc"

type RequestType = {
    params?: Object,
    data?: Object
}

type Response<T = any> = {
    status: number,
    data: T,
    msg: string
}

interface courseDetail extends Object {
    course: course,
    testList: test[]
}

interface testDetail extends Object {
    course: course,
    test: test,
    questionList: quiz[] | homework[],
    totalPages: number
}

interface gameDetail extends Object {
    info: {
        passed: number,
        talented: number
    },
    state: {
        less: boolean,
        more: boolean,
        reward: boolean
    }
}

const apiInfo = {
    'guessGame': {
        url: '/game/guess',
        method: 'POST',
        token: true
    },
    'getGameInfo': {
        url: '/game/guess',
        method: 'GET',
        token: true
    },
    'refreshGameNumber': {
        url: '/game/guess',
        method: 'PUT',
        token: true
    },
    'getCourseList': {
        url: '/mooc/course',
        method: 'GET',
        token: false
    },
    'addCourse': {
        url: '/mooc/course/:cid',
        method: 'POST',
        token: true
    },
    'getCourseDetail': {
        url: '/mooc/course/:cid',
        method: 'GET',
        token: false
    },
    'getTestDetail': {
        url: '/mooc/test/:tid',
        method: 'GET',
        token: false
    },
    'getAnnouncement': {
        url: '/mooc/announcement',
        method: 'GET',
        token: false
    }
}

export type ApiKeyType = keyof typeof apiInfo

export interface ApiResponseType {
    'guessGame': Response<gameDetail>,
    'getGameInfo': Response<{
        passed: number,
        talented: number
    }>,
    'refreshGameNumber': Response<null>,
    'getCourseList': Response<course[]>,
    'addCourse': Response<{
        finished: number,
        total: number
    }>,
    'getCourseDetail': Response<courseDetail>,
    'getTestDetail': Response<testDetail>,
    'getAnnouncement': Response<string>
}

export interface ApiRequestType {
    'guessGame': RequestType & {
        data: { guess: number | string }
    },
    'getGameInfo': RequestType,
    'refreshGameNumber': RequestType,
    'getCourseList': RequestType,
    'addCourse': RequestType & {
        params: { cid: number | string }
    },
    'getCourseDetail': RequestType & {
        params: { cid: number | string }
    },
    'getTestDetail': RequestType & {
        params: {
            tid: number | string,
            page: number | string,
            search?: string
        }
    },
    'getAnnouncement': RequestType
}

export default apiInfo