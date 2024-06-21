<script setup lang="ts">
import type { homework } from "@/type/mooc"

const props = defineProps<{
    data: homework
    seq: string
}>()
props.data.title = props.data.title.replaceAll(/img\d\.ph\.126\.net/g, 'img-ph-mirror.nosdn.127.net')
props.data.answer = <string>props.data.answer?.replaceAll(/img\d\.ph\.126\.net/g, 'img-ph-mirror.nosdn.127.net')
</script>

<template>
    <div class="question-card-header">
        <span class="question-card__seq">{{ seq }}</span>
        <div class="question-card__title" v-html="data.title"></div>
    </div>
    <div class="question-card-body">
        <span v-html="data.answer"></span>
    </div>
</template>

<style scoped></style>
