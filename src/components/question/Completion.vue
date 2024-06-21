<script setup lang="ts">
import type { quiz } from "@/type/mooc"
import { ref } from "vue"

const props = defineProps<{
    data: quiz
    seq: string
}>()
const stdAnswerArray = (props.data.stdAnswer as string).split("##%_YZPRLFH_%##")
const [answer, backgroundColor, color] = [ref(""), ref("transparent"), ref("")]

const checkAnswer = () => {
    const answerArray = answer.value.split(" / ")
    for (const item of answerArray) {
        if (stdAnswerArray.indexOf(item) === -1) {
            backgroundColor.value = "transparent"
            color.value = ""
            return
        }
    }
    backgroundColor.value = "var(--el-color-success-light-8)"
    color.value = "var(--el-color-primary)"
}

const setAnswer = () => {
    let splicedAnswer = ""
    const len = stdAnswerArray.length
    for (let i = 0; i < len; i++) {
        if (i > 0) {
            splicedAnswer += " / "
        }
        splicedAnswer += stdAnswerArray[i]
    }
    answer.value = splicedAnswer
    checkAnswer()
}
props.data.title = props.data.title.replaceAll(/img\d\.ph\.126\.net/g, 'img-ph-mirror.nosdn.127.net')
</script>

<template>
    <div class="question-card-header" @click="setAnswer">
        <span class="question-card__seq">{{ seq }}</span>
        <div class="question-card__title" v-html="data.title"></div>
    </div>
    <div class="question-card-body">
        <ElInput
            size="large"
            class="answer-input"
            v-model="answer"
            placeholder="在这里输入答案"
            @input="checkAnswer"
        ></ElInput>
    </div>
</template>

<style scoped>
.answer-input {
    background-color: v-bind(backgroundColor);
}
.answer-input :deep(.el-input__wrapper, .el-input__inner) {
    background-color: transparent;
}
.answer-input :deep(.el-input__inner) {
    color: v-bind(color);
}
</style>
