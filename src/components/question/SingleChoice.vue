<script setup lang="ts">
import type { option, quiz } from "@/type/mooc"
import { ref } from "vue"

const props = defineProps<{
    data: quiz
    seq: string
}>()
const isChecked = ref(0)
const answer = (() => {
    for (const item of <option[]>props.data.optionList) {
        if (item.answer) {
            return item.id
        }
    }
    return 0
})()

const checkedColor = (option: option) => {
    if (option.id !== isChecked.value) {
        return "transparent"
    }
    return option.answer ? "var(--el-color-success-light-8)" : "var(--el-color-error-light-8)"
}
const setAnswer = () => (isChecked.value = answer)
</script>

<template>
    <div class="question-card-header" @click="setAnswer">
        <span class="question-card__seq">{{ seq }}</span>
        <div class="question-card__title" v-html="data.title"></div>
    </div>
    <div class="question-card-body">
        <ElRadioGroup v-model="isChecked" class="radio-group">
            <ElRadio
                class="radio-item"
                :class="{ 'is-selected': option.id === isChecked }"
                v-for="option in data.optionList"
                :label="option.id"
                size="large"
                style="margin: 0"
                :style="{ 'background-color': checkedColor(option) }"
                ><span class="radio-item__content" v-html="option.content"></span
            ></ElRadio>
        </ElRadioGroup>
    </div>
</template>

<style scoped>
.radio-group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.radio-item {
    padding: 8px 8px;
    height: auto !important;
}
.radio-item :deep(img) {
    max-width: 100%;
}
.radio-item:not(.is-selected):hover {
    background-color: var(--el-color-primary-light-8) !important;
}
</style>
