import { CustomRefList } from "./plugins/react"
import { useApiAccess } from "./plugins/apiAccess"
import { sleep, getUrlParam } from "./plugins/tool"
import { getQuizQuestionKeys, setQuizAnswer, setHomeworkAnswer, autoEvaluate, batchEvaluate } from "./plugins/mooc"
import { newExamHandle } from "./newExam"

const apiAccess = useApiAccess()
const refList = new CustomRefList()
const testType = refList.add(<"quiz" | "homework" | undefined>undefined)
const newCourseState = refList.add(-1)
let testId: string | null = null
const [analysis, prepare, examlist] = [refList.add(false), refList.add(false), refList.add(false)]

if (location.href.indexOf("newExam") !== -1) {
    newExamHandle()
}

const getAnswer = async () => {
    if (stateTips.innerText === "正在获取答案，请稍后...") {
        return
    }
    stateTips.innerText = "正在获取答案，请稍后..."
    if (testType.get() === "quiz") {
        const answers = await apiAccess("selectQustion", { tid: testId as string }, getQuizQuestionKeys())
        setQuizAnswer(answers.data.choiceAns as number[], answers.data.completionAns as Object)
    } else if (testType.get() === "homework") {
        const answers = await apiAccess("selectQustion", { tid: testId as string }, {})
        setHomeworkAnswer(answers.data.homeworkAns as Object)
    }
    stateTips.innerText = ""
}

const styleNode = document.createElement("style")
styleNode.innerText = `
    input.gin-answer:not(:checked) + label, #GinsMooc, .gin-answer-item {
        background-color: #d9ecff;
    }
    .learnPageContentLeft {
        background: rgb(240, 242, 245);
    }
    #GinsMooc {
        margin-bottom: 12px !important;
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
document.querySelector(".learnPageContentLeft")?.prepend(wrapperNode)

if (location.href.indexOf("/spoc") !== -1) {
    const spocTipsNode = document.createElement("div")
    spocTipsNode.innerHTML = "当前课程为 SPOC 课程，可能无法获取答案。SPOC 课程可能会有关联的对外课程，你可以尝试搜索并加入，题目大概率是一样的"
    wrapperNode.prepend()
}

const setNotice = async () => {
    const notice = (await apiAccess("getNotice", { version: "v2.2.1" }, undefined)).data
    console.log(notice)
    if (
        !localStorage
            .getItem("Gins-ignore-notice")
            ?.split(",")
            .find((item) => Number.parseInt(item) === notice.id)
    ) {
        const noticeNode = document.createElement("div")
        noticeNode.innerHTML = notice.content
        const closeBtn = document.createElement("a")
        closeBtn.innerText = "不再提醒"
        closeBtn.onclick = () => {
            const origin = localStorage.getItem("Gins-ignore-notice")
            localStorage.setItem("Gins-ignore-notice", origin ? `${origin},${notice.id}` : `${notice.id}`)
            noticeNode.remove()
            closeBtn.remove()
        }
        closeBtn.style.marginLeft = "16px"
        noticeNode.append(closeBtn)
        wrapperNode.prepend(noticeNode)
    }
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
evaluateBtn.onclick = () => {
    autoEvaluate()
    window.scroll({ top: document.documentElement.scrollHeight, behavior: "smooth" })
}
evaluateBtn.innerText = "一键互评"
functionNode.append(evaluateBtn)

const batchEvaluateBtn = document.createElement("button")
batchEvaluateBtn.classList.add("u-btn", "u-btn-default", "f-dn")
batchEvaluateBtn.onclick = () => {
    batchEvaluate(5, (finish: number, total: number) => {
        if (finish >= total) {
            stateTips.innerText = `已完成 ${total} 次互评`
        } else {
            stateTips.innerText = `自动互评中（${finish} / ${total}）`
        }
    })
}
batchEvaluateBtn.innerText = "自动互评"
functionNode.append(batchEvaluateBtn)


const stateTips = document.createElement("div")
stateTips.classList.add("gin-state-tips")
functionNode.append(stateTips)

window.addEventListener("hashchange", () => {
    testId = getUrlParam("id")
    if (location.hash.indexOf("quiz") !== -1 || location.hash.indexOf("examObject") !== -1) {
        testType.set("quiz")
    } else if (location.hash.indexOf("hw") !== -1 || location.hash.indexOf("examSubjective") !== -1) {
        testType.set("homework")
    } else {
        testType.set(undefined)
    }
})

window.setInterval(() => {
    examlist.set(location.hash.indexOf("examlist") !== -1)
    const prepareNode = document.querySelector(".j-prepare.prepare")
    prepare.set(
        (prepareNode && !prepareNode.classList.contains("f-dn")) ||
            document.querySelector(".j-homework-paper") !== null ||
            examlist.get()
    )
    analysis.set(document.querySelector(".u-questionItem.u-analysisQuestion.analysisMode") !== null)
}, 100);

const onTestChange = async () => {
    console.log("onTestChange", testType.get(), prepare.get(), examlist.get(), testId)
    if ((testType.get() === "quiz" && !prepare.get()) || testType.get() === "homework") {
        getAnswerBtn.classList.remove("f-dn")
    } else {
        getAnswerBtn.classList.add("f-dn")
    }

    newCourseState.set(-2)
    if (prepare.get() && testId) {
        const res = await apiAccess("checkTestExist", { tid: testId, type: "isExisting" }, undefined)
        if (res.data.existing) {
            newCourseState.set(-1)
            return
        } else {
            const eventSource = new EventSource(`https://ginnnnnn.top/api/mooc/course/refresh/${getUrlParam("tid")}`)
            eventSource.onmessage = (event) => {
                console.log(event.data)
                const state = JSON.parse(event.data)
                if (state && state.total > 0) {
                    newCourseState.set(Math.round((state.finished / state.total) * 100))
                }
                if (newCourseState.value === 100 || state.status === 400) {
                    eventSource.close()
                    if (state.msg) {
                        newCourseState.set(-1)
                    }
                }
            }
        }
    } else if (!examlist.get()) {
        newCourseState.set(-1)
        return
    }
}

const onModeChange = () => {
    console.log("onModeChange", analysis.get())
    if (analysis.get()) {
        evaluateBtn.classList.remove("f-dn")
        batchEvaluateBtn.classList.remove("f-dn")
    } else {
        evaluateBtn.classList.add("f-dn")
        batchEvaluateBtn.classList.add("f-dn")
    }
}

analysis.addEventListenr("change", onModeChange)
prepare.addEventListenr("change", onTestChange)
testType.addEventListenr("change", onTestChange)
newCourseState.addEventListenr("set", () => {
    switch (newCourseState.get()) {
        case -2:
            stateTips.innerText = "正在检查课程..."
            break
        case -1:
            stateTips.innerText = prepare.get() ? "已准备就绪" : ""
            break
        default:
            stateTips.innerText = `正在更新课程...${newCourseState.get()}%`
            break
    }
})
