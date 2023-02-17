import { CustomRefList } from "./plugins/react"
import { useApiAccess } from "./plugins/apiAccess"
import { sleep, getUrlParam } from "./plugins/tool"
import { getQuizQuestionKeys, setQuizAnswer, setHomeworkAnswer, autoEvaluate, autoComment } from "./plugins/mooc"

const apiAccess = useApiAccess()
const refList = new CustomRefList()
const testType = refList.add(<"quiz" | "homework" | undefined>undefined)
const newCourseState = refList.add(-1)
let testId: string | null = null
const [analysis, prepare, examlist] = [refList.add(false), refList.add(false), refList.add(false)]

const getAnswer = async () => {
    if (testType.get() === "quiz") {
        const answers = await apiAccess("selectQustion", { tid: testId as string }, getQuizQuestionKeys())
        setQuizAnswer(answers.data.choiceAns as Object, answers.data.completionAns as Object)
    } else if (testType.get() === "homework") {
        const answers = await apiAccess("selectQustion", { tid: testId as string }, {})
        setHomeworkAnswer(answers.data.homeworkAns as Object)
    }
}

const styleNode = document.createElement("style")
styleNode.innerText = `
    input.gin-answer:not(:checked) + label, #GinsMooc, .gin-answer-item {
        background-color: #d9ecff;
    }
    .gin-function {
        display: flex;
        align-items: center;
    }
    .gin-function .u-btn {
        margin-right: 16px;
    }
    .gin-state-tips {
        font-size: 14px;
    }
`
document.head.append(styleNode)

const wrapperNode = document.createElement("div")
wrapperNode.id = "GinsMooc"
wrapperNode.classList.add("m-learnbox")
document.querySelector(".g-mn1c")?.prepend(wrapperNode)

const setNotice = async () => {
    const announcement = (await apiAccess("getAnnouncement")).data
    const noticeNode = document.createElement("div")
    noticeNode.innerHTML = announcement === "无" ? "" : announcement
    wrapperNode.prepend(noticeNode)
}
setNotice()

const functionNode = document.createElement("div")
functionNode.classList.add("gin-function")
wrapperNode.append(functionNode)

const getAnswerBtn = document.createElement("button")
getAnswerBtn.classList.add("u-btn", "u-btn-default", "f-dn")
getAnswerBtn.onclick = getAnswer
getAnswerBtn.innerText = "获取答案"
functionNode.append(getAnswerBtn)

const evaluateBtn = document.createElement("button")
evaluateBtn.classList.add("u-btn", "u-btn-default", "f-dn")
evaluateBtn.onclick = autoEvaluate
evaluateBtn.innerText = "一键评分"
functionNode.append(evaluateBtn)

const commentBtn = document.createElement("button")
commentBtn.classList.add("u-btn", "u-btn-default", "f-dn")
commentBtn.onclick = autoComment
commentBtn.innerText = "一键点评"
functionNode.append(commentBtn)

const stateTips = document.createElement("div")
stateTips.classList.add("gin-state-tips")
functionNode.append(stateTips)

window.addEventListener("hashchange", () => {
    testId = getUrlParam("id")
    if (location.hash.indexOf("quiz") !== -1 || location.hash.indexOf("examObjective") !== -1) {
        testType.set("quiz")
    } else if (location.hash.indexOf("hw") !== -1 || location.hash.indexOf("examSubjective") !== -1) {
        testType.set("homework")
    } else {
        testType.set(undefined)
    }
})

document.getElementById("courseLearn-inner-box")?.addEventListener("DOMNodeInserted", () => {
    examlist.set(location.hash.indexOf("examlist") !== -1)
    const prepareNode = document.querySelector(".j-prepare.prepare")
    prepare.set(
        (prepareNode && !prepareNode.classList.contains("f-dn")) ||
        document.querySelector(".j-homework-paper") !== null ||
        examlist.get()
    )
    analysis.set(document.querySelector(".u-questionItem.u-analysisQuestion.analysisMode") !== null)
})

const onTestChange = async () => {
    console.log("onTestChange", testType.get(), prepare.get(), examlist.get(), testId)
    if ((testType.get() === 'quiz' && !prepare.get()) || testType.get() === 'homework') {
        getAnswerBtn.classList.remove("f-dn")
    } else {
        getAnswerBtn.classList.add("f-dn")
    }
    if (prepare.get() && testId) {
        const res = await apiAccess("checkTestExist", { tid: testId, type: "isExisting" }, undefined)
        if (res.data.existing) {
            newCourseState.set(-1)
            return
        }
    } else if (!examlist.get()) {
        newCourseState.set(-1)
        return
    }
    while (true) {
        const res = await apiAccess("addCourse", { cid: <string>getUrlParam("tid") }, undefined)
        const state = res.data
        if (state) {
            newCourseState.set(Math.round((state.finished / state.total) * 100))
        }
        if (newCourseState.get() === 100) {
            break
        }
        await sleep(500)
    }
    newCourseState.set(-1)
}

const onModeChange = () => {
    console.log("onModeChange", analysis.get())
    if (analysis.get()) {
        evaluateBtn.classList.remove("f-dn")
        commentBtn.classList.remove("f-dn")
    } else {
        evaluateBtn.classList.add("f-dn")
        commentBtn.classList.add("f-dn")
    }
}

analysis.addEventListenr("change", onModeChange)
prepare.addEventListenr("change", onTestChange)
testType.addEventListenr("change", onTestChange)
newCourseState.addEventListenr("set", () => {
    stateTips.innerText = newCourseState.get() === -1 ? (prepare.get() ? "已准备就绪" : "") : `正在更新课程...${newCourseState.get()}%`
})