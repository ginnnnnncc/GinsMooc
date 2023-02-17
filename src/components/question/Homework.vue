<script setup lang="ts">
import type { homework } from "@/type/mooc"

const props = defineProps<{
    data: homework
    seq: string
}>()
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
