<script setup lang="ts">
import type { homework } from "@/type/mooc"
import { computed } from "vue"

const props = defineProps<{
    data: homework
    seq: string
}>()
const timeLimit = computed(() => `${props.data.memoryLimit! / 1000}s`)
const memoryLimit = computed(() => {
    let memValue = props.data.memoryLimit! / 1024
    return memValue < 1024 ? `${memValue}KB` : `${memValue / 1024}MB`
})
props.data.title = props.data.title.replaceAll(/img\d\.ph\.126\.net/g, 'img-ph-mirror.nosdn.127.net')
props.data.description = <string>props.data.description?.replaceAll(/img\d\.ph\.126\.net/g, 'img-ph-mirror.nosdn.127.net')
</script>

<template>
    <div class="question-card-header">
        <span class="question-card__seq">{{ seq }}</span>
        <div class="question-card__title" v-html="data.title"></div>
    </div>
    <div class="question-card-body">
        <div>
            <ElTag>描述</ElTag>
            <span class="question-desc" v-html="data.description"></span>
        </div>
        <ElRow>
            <ElCol :span="12"
                ><ElTag type="danger">时间限制</ElTag><span>{{ timeLimit }}</span></ElCol
            >
            <ElCol :span="12"
                ><ElTag type="danger">内存限制</ElTag><span>{{ memoryLimit }}</span></ElCol
            >
        </ElRow>
    </div>
</template>

<style scoped>
</style>
