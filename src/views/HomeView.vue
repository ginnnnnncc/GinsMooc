<script setup lang="ts">
import BlogView from "@/views/BlogView.vue"
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
        <div class="home-loading" v-loading="true" element-loading-text="Loading..."></div>
        <BlogView></BlogView>
        <div class="home-footer">
            <ElLink href="https://beian.miit.gov.cn" :underline="false" target="_blank" style="font-size: 12px">
                粤ICP备2022090073号</ElLink>
            <span class="copyright">©2022-2024 by gin</span>
        </div>
    </div>
</template>

<style scoped>
.home-loading {
    z-index: -1;
    position: absolute;
    height: calc(100vh - 50px);
    width: 100%;
}

.home {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home-footer {
    z-index: 10;
    position: absolute;
    bottom: 0;
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
