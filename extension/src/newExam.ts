import { useApiAccess } from "./plugins/apiAccess"
import { sleep, getUrlParam } from "./plugins/tool"

export const newExamHandle = async () => {
    const LOG_PREFIX = "[GinsMooc]"
    console.log(LOG_PREFIX, "newExamHandle started")

    const apiAccess = useApiAccess()
    let form = document.getElementById("app")?.getElementsByTagName("form").item(0)

    while (!form) {
        await sleep(1000)
        form = document.getElementById("app")?.getElementsByTagName("form").item(0)
    }
    console.log(LOG_PREFIX, "form found", form)

    const getAnswer = async () => {
        console.log(LOG_PREFIX, "getAnswer called - event triggered successfully!")
        try {
            const info = await apiAccess(
                "getNewExamInfo",
                { csrfKey: document.cookie.match(/NTESSTUDYSI=([a-z0-9]+);/)![1] },
                { answerformId: getUrlParam("aid")!, examId: getUrlParam("eid")! }
            )
            console.log(LOG_PREFIX, "getNewExamInfo response", info)
            let oidList: Array<number> = []
            for (let question of info.result.questions) {
                for (let option of question.optionDtos) {
                    oidList.push(option.id)
                }
            }
            const answers = await apiAccess("selectQustion", { tid: info.result.tid }, { oidList: oidList })
            console.log(LOG_PREFIX, "selectQustion response", answers)
            const optionElements = document.querySelectorAll(
                ".ant-checkbox-group>div, .ant-radio-group>div"
            ) as NodeListOf<HTMLDivElement>
            console.log(LOG_PREFIX, "optionElements count", optionElements.length)
            for (let id of answers.data.choiceAns!) {
                optionElements[oidList.indexOf(id)].classList.add("gin-answer-item")
            }
            console.log(LOG_PREFIX, "answers applied successfully")
        } catch (error) {
            console.error(LOG_PREFIX, "getAnswer error:", error)
        }
    }

    // 包装函数：阻止事件传播，确保点击能够触发
    const handleClick = (e: Event) => {
        console.log(LOG_PREFIX, "handleClick triggered, event type:", e.type)
        e.stopPropagation()
        e.stopImmediatePropagation()
        if (e.preventDefault) e.preventDefault()
        getAnswer()
        return false
    }

    const getAnswerBtn = document.createElement("button")
    getAnswerBtn.className = "ant-btn ant-btn-primary"
    getAnswerBtn.setAttribute("style", "margin-bottom: 16px; pointer-events: auto !important; position: relative; z-index: 2147483647;")
    getAnswerBtn.innerText = "获取答案"

    // 多种事件绑定方式，增加触发成功率
    getAnswerBtn.onclick = handleClick
    getAnswerBtn.addEventListener("click", handleClick, true)  // capture 阶段
    getAnswerBtn.addEventListener("pointerdown", handleClick, true)  // 备用：pointer 事件
    getAnswerBtn.addEventListener("mousedown", handleClick, true)  // 备用：mouse 事件
    
    console.log(LOG_PREFIX, "button created with multiple event listeners")
    form?.before(getAnswerBtn)
    console.log(LOG_PREFIX, "button inserted before form")
}
