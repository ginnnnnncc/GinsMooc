export enum QuestionTypeEnumList {
    SingleChoice = "SINGLE_CHOICE",
    MultipleChoice = "MULTIPLE_CHOICE",
    Completion = "COMPLETION",
    Judge = "JUDGEMENT",
    Homework = "HOMEWORK",
    OnlineJudge = "ONLINE_JUDGE"
}

interface course extends Object {
    id: number
    name: string
    school: string
    imageUrl: string
}

interface test extends Object {
    id: number
    name: string
    objective: boolean
    releaseTime: string
    deadline: string
    chapterId: number
    chapterName: string
}

interface option extends Object {
    id: number
    content: string
    answer: boolean
}

interface quiz extends Object {
    id: number
    type:
        | QuestionTypeEnumList.SingleChoice
        | QuestionTypeEnumList.MultipleChoice
        | QuestionTypeEnumList.Completion
        | QuestionTypeEnumList.Judge
    title: string
    stdAnswer: string | null
    optionList: option[] | null
}

interface homework extends Object {
    id: number
    type: QuestionTypeEnumList.Homework | QuestionTypeEnumList.OnlineJudge
    title: string
    answer: string | null
    description: string | null
    memoryLimit: number | null
    timeLimit: number | null
}

export type QuestionTypeEnum = typeof QuestionTypeEnumList
export type { course, test, option, quiz, homework }
