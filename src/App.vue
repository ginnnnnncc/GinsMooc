<script setup lang="ts">
import { ref } from "vue"
import { useDark } from "@vueuse/core"
import { HomeFilled, Message, Moon, Promotion, Sunny } from "@element-plus/icons-vue"
import { Github } from "@/components/icon"

const isDark = useDark()

const themeStyle = {
    "--el-switch-on-color": "var(--el-fill-color)",
    "--el-switch-off-color": "var(--el-fill-color)",
    "--el-switch-border-color": "var(--el-border-color-dark)"
}

const emailDialogVisible = ref(false)
const openGithub = () => window.open("https://github.com/ginnnnnn666/GinsMooc")

const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const [messageBtnColor, githubBtnColor] = [ref(0), ref(0)]
</script>

<template>
    <ElContainer>
        <ElHeader class="header" height="50px">
            <ElSpace :size="8" class="nav">
                <ElMenu :default-active="$route.path" mode="horizontal" router class="nav-start" :ellipsis="false">
                    <ElMenuItem class="menu-item" index="/">
                        <ElIcon :size="30"><HomeFilled /></ElIcon>
                    </ElMenuItem>
                    <ElMenuItem class="menu-item" index="/mooc">Mooc</ElMenuItem>
                    <ElMenuItem class="menu-item" index="/video">Video</ElMenuItem>
                    <ElMenuItem class="menu-item" index="/game/newest">Game</ElMenuItem>
                </ElMenu>
                <div class="nav-center"><RouterView name="header" /></div>
                <ElSpace :size="16" class="nav-end">
                    <ElIcon
                        :color="color[messageBtnColor % 2]"
                        :size="25"
                        @click="emailDialogVisible = true"
                        @mouseenter="messageBtnColor++"
                        @mouseleave="messageBtnColor++"
                        style="cursor: pointer"
                    >
                        <Message />
                    </ElIcon>
                    <ElSwitch
                        v-model="isDark"
                        inline-prompt
                        :active-icon="Moon"
                        :inactive-icon="Sunny"
                        :style="themeStyle"
                        class="theme-switch"
                    ></ElSwitch>
                    <ElIcon
                        :color="color[githubBtnColor % 2]"
                        :size="30"
                        @click="openGithub"
                        @mouseenter="githubBtnColor++"
                        @mouseleave="githubBtnColor++"
                        style="cursor: pointer"
                    >
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
        <span>若为反馈，请说明出现问题的具体课程、课程id、哪个测验/作业/考试。</span>
        <br /><br />
        <span>
            <span>发送邮件至：</span>
            <ElLink type="primary" href="mailto:ginnnnnn-cc@outook.com" class="link-mail">
                <span>ginnnnnn-cc@outook.com</span>
                <ElIcon class="el-icon--right" style="margin-left: 6px !important"><Promotion /></ElIcon>
            </ElLink>
        </span>
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
.theme-switch .el-switch__core .el-switch__inner .is-icon,
.el-switch__core {
    color: var(--el-text-color-primary);
}
.theme-switch .el-switch__core .el-switch__action {
    background-color: var(--el-bg-color);
}
</style>
