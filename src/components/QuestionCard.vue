<script setup lang="ts">
import type { quiz, homework, option } from "@/type/mooc"
import { QuestionTypeEnumList } from "@/type/mooc"
import { Completion, SingleChoice, MultipleChoice, Homework, OnlineJudge } from "@/components/question"

const props = defineProps<{
    data: quiz | homework
    order: number
}>()

const seq = (() => {
    const ret = props.order.toString()
    if (ret.length < 2) {
        return "0" + ret
    }
    return ret
})()

const isSingleChoice = (data: quiz | homework): data is quiz => {
    return data.type === QuestionTypeEnumList.SingleChoice || data.type === QuestionTypeEnumList.Judge
}
const isMultipleChoice = (data: quiz | homework): data is quiz => data.type === QuestionTypeEnumList.MultipleChoice
const isCompletion = (data: quiz | homework): data is quiz => data.type === QuestionTypeEnumList.Completion
const isRegularHomework = (data: quiz | homework): data is homework => data.type === QuestionTypeEnumList.Homework
const isOnlineJudge = (data: quiz | homework): data is homework => data.type === QuestionTypeEnumList.OnlineJudge
</script>

<template>
    <ElContainer class="question-card">
        <SingleChoice v-if="isSingleChoice(data)" :data="data" :seq="seq"></SingleChoice>
        <MultipleChoice v-else-if="isMultipleChoice(data)" :data="data" :seq="seq"></MultipleChoice>
        <Completion v-else-if="isCompletion(data)" :data="data" :seq="seq"></Completion>
        <Homework v-else-if="isRegularHomework(data)" :data="data" :seq="seq"></Homework>
        <OnlineJudge v-else-if="isOnlineJudge(data)" :data="data" :seq="seq"></OnlineJudge>
    </ElContainer>
</template>

<style scoped>
.question-card {
    height: fit-content;
    display: flex;
    flex-direction: column;
    padding: 20px 40px;
    margin-top: 20px;
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
    transition: all 0.2s;
}
.question-card:hover {
    transform: scale(1.02);
}
.question-card :deep(.question-card-header) {
    margin-bottom: 14px;
    color: var(--el-text-color-primary);
    line-height: 1.5;
}
.question-card :deep(.question-card-body) {
    color: var(--el-text-color-primary);
    line-height: 1.5;
}
.question-card :deep(.el-checkbox__label), .question-card :deep(.el-radio__label) {
    white-space: normal;
    line-height: 1.5;
    color: var(--el-text-color-primary);
}
.question-card :deep(.question-card__seq) {
    float: left;
    margin-right: 8px;
    font-weight: 700;
    font-size: 16px;
    color: var(--el-text-color-primary);
}
.question-card :deep(.question-card__title img) {
    max-width: 100%;
}
</style>
