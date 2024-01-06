<script setup lang="ts">
import type { course } from "@/type/mooc"
import { ElImage } from "element-plus"

const props = defineProps<{
    course: course
}>()

const emit = defineEmits<{
    (e: 'click', course: course, event: MouseEvent): void
}>()
</script>

<template>
    <li :class="{ 'course-card': true }" @click="$emit('click', course, $event)">
        <ElImage :src="course.imageUrl" class="course-card__img" lazy></ElImage>
        <div class="course-card__info">
            <div class="course-card__info-name">{{ course.name }}</div>
            <div class="course-card__info-school">{{ course.school }}</div>
        </div>
    </li>
</template>

<style scoped>
.course-card {
    margin-bottom: 8px;
    height: auto;
    padding: 18px 12px 18px 24px;
    display: flex;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
}
.course-card:last-child {
    margin-bottom: 0;
}

.course-card:active {
    transform: scale(0.98);
}

.course-card.is-selected, .course-card:not(.is-selected):active {
    background-color: var(--el-color-primary-light-5);
    z-index: 5;
}

.course-card:not(.is-selected):hover {
    background-color: var(--el-color-primary-light-7);
}

.course-card__img {
    height: 48px;
    width: 85px;
    border-radius: 8px;
    margin-right: 16px;
}

.course-card__info {
    flex: 1;
    display: flex;
    width: 186px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-direction: column;
}

.course-card__info-name {
    flex: 1;
    font-size: 18px;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.course-card__info-school {
    font-size: 12px;
    color: var(--el-text-color-secondary);
}
</style>
