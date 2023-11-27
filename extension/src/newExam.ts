import { useApiAccess } from "./plugins/apiAccess"
import { sleep, getUrlParam } from "./plugins/tool"

export const newExamHandle = async () => {
    const apiAccess = useApiAccess()
    let form = document.getElementById("app")?.getElementsByTagName("form").item(0)

    while (!form) {
        await sleep(1000)
        form = document.getElementById("app")?.getElementsByTagName("form").item(0)
    }

    const getAnswer = async () => {
        const info = await apiAccess(
            "getNewExamInfo",
            { csrfKey: document.cookie.match(/NTESSTUDYSI=([a-z0-9]+);/)![1] },
            { answerformId: getUrlParam("aid")!, examId: getUrlParam("eid")! }
        )
        let oidList: Array<number> = []
        for (let question of info.result.questions) {
            for (let option of question.optionDtos) {
                oidList.push(option.id)
            }
        }
        const answers = await apiAccess("selectQustion", { tid: info.result.tid }, { oidList: oidList })
        const optionElements = document.querySelectorAll(
            ".ant-checkbox-group>div, .ant-radio-group>div"
        ) as NodeListOf<HTMLDivElement>
        // console.log(optionElements)
        for (let id of answers.data.choiceAns!) {
            optionElements[oidList.indexOf(id)].classList.add("gin-answer-item")
        }
    }

    const getAnswerBtn = document.createElement("button")
    getAnswerBtn.className = "ant-btn ant-btn-primary"
    getAnswerBtn.setAttribute("style", "margin-bottom: 16px")
    getAnswerBtn.onclick = getAnswer
    getAnswerBtn.innerText = "获取答案"
    form?.before(getAnswerBtn)
}
