<script setup lang="ts">
import { GameView } from "@/views"
import { ref } from "vue"

const disabled = ref(true)
const c = () => {
    if (disabled.value === false) {
        console.log("click")
    }
}
</script>

<template>
    <div class="home">
        <GameView></GameView>
        <div class="home-footer">
            <ElLink href="https://beian.miit.gov.cn" :underline="false" target="_blank" style="font-size: 12px"
                >粤ICP备2022090073号</ElLink
            >
            <span class="copyright">©2022-2023 by gin</span>
        </div>
    </div>
</template>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.home-footer {
    display: flex;
    justify-content: center;
    font-size: 12px;
    padding-bottom: 12px;
}
.copyright {
    margin-left: 16px;
    display: flex;
    align-items: center;
    color: var(--el-text-color-regular);
}
</style>
