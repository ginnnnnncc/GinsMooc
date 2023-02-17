<script setup lang="ts">
import type { quiz, option } from "@/type/mooc"
import { ref } from "vue"

const props = defineProps<{
    data: quiz
    seq: string
}>()
const checkedList = ref(<Array<number>>new Array())
const answerList = (() => {
    let ret = <Array<number>>new Array()
    for (const item of <option[]>props.data.optionList) {
        if (item.answer) {
            ret.push(item.id)
        }
    }
    return ret
})()

const inAnswerList = (element: number) => answerList.indexOf(element) >= 0
const inCheckedList = (element: number) => checkedList.value.indexOf(element) >= 0
const checkedColor = (option: option) => {
    if (checkedList.value.length !== answerList.length) {
        return "transparent"
    }
    if (checkedList.value.every(inAnswerList)) {
        return inAnswerList(option.id) ? "var(--el-color-success-light-8)" : "transparent"
    }
}
const setAnswer = () => {
    checkedList.value.length = 0
    answerList.forEach((value) => checkedList.value.push(value))
}
</script>

<template>
    <div class="question-card-header" @click="setAnswer">
        <span class="question-card__seq">{{ seq }}</span>
        <div class="question-card__title" v-html="data.title"></div>
    </div>
    <div class="question-card-body">
        <ElCheckboxGroup v-model="checkedList" class="checkbox-group">
            <ElCheckbox
                class="checkbox-item"
                :class="{ 'is-selected': inCheckedList(option.id) }"
                v-for="option in data.optionList"
                :label="option.id"
                size="large"
                style="margin: 0;"
                :style="{ 'background-color': checkedColor(option) }"
                ><span class="checkbox-item__content" v-html="option.content"></span
            ></ElCheckbox>
        </ElCheckboxGroup>
    </div>
</template>

<style scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.checkbox-item {
    padding: 8px 8px;
    height: auto !important;
}
.checkbox-item:not(.is-selected):hover {
    background-color: var(--el-color-primary-light-8) !important;
}
</style>
