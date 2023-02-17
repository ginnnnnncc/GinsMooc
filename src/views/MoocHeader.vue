<script setup lang="ts">
import { ElRow, ElCol } from 'element-plus';
</script>

<template>
<ElRow>
    <ElCol :span="8"></ElCol>
    <ElCol :span="8"></ElCol>
    <ElCol :span="8">
        <ElRow justify="end"></ElRow>
    </ElCol>
</ElRow>
</template>
