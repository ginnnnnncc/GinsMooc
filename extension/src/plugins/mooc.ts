import type { quiz, option } from "@/type/mooc"
import { sleep } from "./tool"

const getQuizQuestionKeys = () => {
    const [oidList, titleList] = [new Array<number>(), new Array<string>()]
    const choices = document.querySelectorAll('input[id^="op_"]')
    for (let i = 0; i < choices.length; i++) {
        const choice = choices.item(i) as HTMLInputElement
        oidList.push(Number.parseInt(choice.id.slice(3, -13)))
    }
    const completions = document.getElementsByClassName("m-FillBlank examMode u-questionItem")
    for (let i = 0; i < completions.length; i++) {
        const questionNode = completions.item(i) as HTMLDivElement
        const titleNode = questionNode.querySelector(".j-richTxt") as HTMLDivElement
        titleList.push(titleNode.innerText)
    }
    return { oidList, titleList }
}

const setQuizAnswer = (choiceAns: number[], completionAns: Object) => {
    for (const id of choiceAns) {
        const node = document.querySelector(`input[id^="op_${id}"]`) as HTMLInputElement
        node.classList.add("gin-answer")
    }
    const completions = document.getElementsByClassName("m-FillBlank examMode u-questionItem")
    for (let i = 0; i < completions.length; i++) {
        const questionNode = completions.item(i) as HTMLDivElement
        const titleNode = questionNode.querySelector(".j-richTxt") as HTMLDivElement
        const question = Reflect.get(completionAns, titleNode.innerText) as quiz

        const newTitleNode = document.createElement("div")
        newTitleNode.innerHTML = question.title
        titleNode.appendChild(newTitleNode)

        const answerList = (<string>question.stdAnswer).split("##%_YZPRLFH_%##")
        const answerListNode = document.createElement("div")
        for (let j = 0; j < answerList.length; j++) {
            const answerNode = document.createElement("span")
            answerNode.classList.add("gin-answer-item")
            answerNode.innerHTML = answerList[j]
            answerListNode.append(answerNode)
            if (j !== answerList.length - 1) {
                answerListNode.append(" / ")
            }
        }
        titleNode.append(answerListNode)
    }
}

const setHomeworkAnswer = (homeworkAns: Object) => {
    const homeworks = document.getElementsByClassName("f-richEditorText j-richTxt f-fl")
    for (let i = 0; i < homeworks.length; i++) {
        const answerNode = document.createElement("div")
        answerNode.innerHTML = Reflect.get(homeworkAns, `${i}`)?.answer as string
        answerNode.prepend("参考答案：")
        homeworks.item(i)?.append(answerNode)
    }
}

const autoEvaluate = () => {
    const analysis = document.getElementsByClassName("u-questionItem u-analysisQuestion analysisMode")
    for (let i = 0; i < analysis.length; i++) {
        const radio = analysis.item(i)?.querySelector(".s")?.querySelector("label:last")
            ?.querySelector("input") as HTMLInputElement
        radio.checked = true
    }
}

const autoComment = () => {
    const analysis = document.getElementsByClassName("u-questionItem u-analysisQuestion analysisMode")
    for (let i = 0; i < analysis.length; i++) {
        sleep(50)
        const textarea = analysis.item(i)?.querySelector("textarea") as HTMLTextAreaElement
        textarea.value = "666"
    }
    window.scroll({ top: document.documentElement.clientHeight, behavior: "smooth" })
}

export { getQuizQuestionKeys, setHomeworkAnswer, setQuizAnswer, autoEvaluate, autoComment }