<script setup lang="ts">
import { ref } from "vue"
import { useDark } from "@vueuse/core"
import { HomeFilled, Message, Moon, Promotion, Sunny, Document } from "@element-plus/icons-vue"
import { Github } from "@/components/icon"
import router from "@/router"

const isDark = useDark()

const themeStyle = {
    "--el-switch-on-color": "var(--el-fill-color)",
    "--el-switch-off-color": "var(--el-fill-color)",
    "--el-switch-border-color": "var(--el-border-color-dark)"
}

const emailDialogVisible = ref(false)
const questionDiaglogVisible = ref(false)
const goIndex = () => router.push("/")
const openGithub = () => window.open("https://github.com/ginnnnnn666/GinsMooc")

const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const [messageBtnColor, githubBtnColor, questionBtnColor] = [ref(0), ref(0), ref(0)]
</script>

<template>
    <ElContainer>
        <ElHeader class="header" height="50px">
            <ElSpace :size="8" class="nav">
                <ElMenu :default-active="$route.path" mode="horizontal" router class="nav-start" :ellipsis="false">
                    <ElImage class="icon" src="/favicon.png" @click="goIndex()"></ElImage>
                    <ElMenuItem class="menu-item" index="/mooc">Mooc</ElMenuItem>
                    <ElMenuItem class="menu-item" index="/video">Video</ElMenuItem>
                </ElMenu>
                <div class="nav-center">
                    <RouterView name="header" />
                </div>
                <ElSpace :size="16" class="nav-end">
                    <ElIcon :color="color[questionBtnColor % 2]" :size="25" @click="questionDiaglogVisible = true"
                        @mouseenter="questionBtnColor++" @mouseleave="questionBtnColor++" style="cursor: pointer">
                        <Document />
                    </ElIcon>
                    <ElIcon :color="color[messageBtnColor % 2]" :size="25" @click="emailDialogVisible = true"
                        @mouseenter="messageBtnColor++" @mouseleave="messageBtnColor++" style="cursor: pointer">
                        <Message />
                    </ElIcon>
                    <ElSwitch v-model="isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" :style="themeStyle"
                        class="theme-switch"></ElSwitch>
                    <ElIcon :color="color[githubBtnColor % 2]" :size="30" @click="openGithub" @mouseenter="githubBtnColor++"
                        @mouseleave="githubBtnColor++" style="cursor: pointer">
                        <Github />
                    </ElIcon>
                    <ElAvatar :size="25" src="/headicon.png"></ElAvatar>
                </ElSpace>
            </ElSpace>
        </ElHeader>
        <ElMain class="main">
            <Suspense>
                <RouterView />
            </Suspense>
        </ElMain>
    </ElContainer>
    <ElDialog v-model="emailDialogVisible">
        <template #header>
            <span>反馈或帮助</span>
        </template>
        <p>若为反馈，请说明出现问题的具体课程、课程id、哪个测验/作业/考试。</p>
        <p>
            <span>发送邮件至：</span>
            <ElLink type="primary" href="mailto:ginnnnnn-cc@outook.com" class="link-mail">
                <span>ginnnnnn-cc@outook.com</span>
                <ElIcon class="el-icon--right" style="margin-left: 6px !important">
                    <Promotion />
                </ElIcon>
            </ElLink>
        </p>
    </ElDialog>
    <ElDialog v-model="questionDiaglogVisible">
        <template #header>问卷小调查</template>
        <p>诚邀您参与问卷小调查：<ElLink type="primary" href="https://wj.qq.com/s2/12623978/b5f8/">https://wj.qq.com/s2/12623978/b5f8/
            </ElLink>
        </p>
        <ElImage style="height: 200px; width: 200px;" src="/question.png"></ElImage>
    </ElDialog>
</template>

<style scoped>
.header {
    padding: 0;
    border-bottom: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color);
}

.main {
    padding: 0;
    display: flex;
    justify-content: center;
}

.nav {
    display: flex;
}

.nav :nth-child(2) {
    flex: 1;
}

.nav-start {
    height: 49px;
    border-bottom: 0;
    background-color: transparent;
    color: var(--el-text-color-primary);
}

.nav-end {
    display: flex;
    justify-content: end;
}

.link-mail {
    font-family: Consolas, "Courier New", monospace;
}
</style>

<style>
body {
    margin: 0;
    height: 100vh;
    transition: margin 0s;
}

i,
p {
    margin: 0 !important;
}

::selection {
    background-color: var(--el-color-primary-light-3);
    color: var(--el-color-white);
}

.el-header,
.el-footer,
.el-main,
.el-aside {
    transition: all var(--el-transition-duration) !important;
}

.el-container {
    height: 100%;
    width: 100%;
}

.icon {
    height: 24px;
    width: 24px;
    margin: 13px 30px;
    cursor: pointer;
}

.theme-switch .el-switch__core .el-switch__inner .is-icon,
.el-switch__core {
    color: var(--el-text-color-primary);
}

.theme-switch .el-switch__core .el-switch__action {
    background-color: var(--el-bg-color);
}
</style>
