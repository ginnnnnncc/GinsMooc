import type { quiz, option } from "../type/mooc"
import { sleep, waitFor } from "./tool"

const getQuizQuestionKeys = () => {
    const [oidList, titleList] = [new Array<number>(), new Array<string>()]
    const choices = document.querySelectorAll('input[id^="op_"]')
    for (let i = 0; i < choices.length; i++) {
        const choice = choices.item(i) as HTMLInputElement
        oidList.push(Number.parseInt(choice.id.split("_")[2].slice(0, -13)))
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
        const node = document.querySelector(`input[id*="_${id}"]`) as HTMLInputElement
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
        answerNode.classList.add('gin-answer-item')
        answerNode.innerHTML = Reflect.get(homeworkAns, `${i}`)?.answer as string
        homeworks.item(i)?.append(answerNode)
    }
}

const autoEvaluate = () => {
    const analysis = document.getElementsByClassName("u-questionItem u-analysisQuestion analysisMode")
    for (let i = 0; i < analysis.length; i++) {
        const radioGroup = analysis.item(i)?.getElementsByClassName("s") as HTMLCollection
        for (let j = 0; j < radioGroup.length; j++) {
            const radio = radioGroup.item(j)?.lastElementChild?.querySelector("input") as HTMLInputElement
            radio.checked = true
        }
        const textarea = analysis.item(i)?.querySelector("textarea") as HTMLTextAreaElement
        textarea.value = "666"
    }
}

const batchEvaluate = async (times: number, updateCaller: (finish: number, total: number) => any) => {
    const submitBtn = document.querySelector(".u-homework-evaAction .bottombtnwrap .j-submitbtn") as HTMLDivElement
    const xlinfo = document.querySelector(".u-homework-evaAction .xlinfo") as HTMLDivElement
    const nextBtn = document.querySelector(".u-homework-evaAction .xlinfo .j-gotonext") as HTMLDivElement
    for (let i = 0; i < times; i++) {
        await waitFor(() => xlinfo.style.display === 'none')
        autoEvaluate()
        await sleep(1000)
        console.log(new Date())
        submitBtn.click()
        await waitFor(() => xlinfo.style.display !== 'none')
        updateCaller(i + 1, times)
        nextBtn.click()
    }
}

export { getQuizQuestionKeys, setHomeworkAnswer, setQuizAnswer, autoEvaluate, batchEvaluate }
