<script setup lang="ts">
import { ref } from "vue"
import { useDark } from "@vueuse/core"
import {  Moon, Sunny } from "@element-plus/icons-vue"
import { Github } from "@/components/icon"
import router from "@/router"

const isDark = useDark()

const themeStyle = {
    "--el-switch-on-color": "var(--el-fill-color)",
    "--el-switch-off-color": "var(--el-fill-color)",
    "--el-switch-border-color": "var(--el-border-color-dark)"
}

const goIndex = () => router.push("/")
const openGithub = () => window.open("https://github.com/ginnnnnn666/GinsMooc")
const spaceCount = () => window.innerWidth < 768 ? 8 : 16

const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const githubBtnColor = ref(0)
</script>

<template>
    <ElContainer>
        <ElHeader class="header">
            <ElSpace :size="8" class="nav">
                <ElMenu :default-active="$route.path" mode="horizontal" router class="nav-start" :ellipsis="false">
                    <ElImage class="icon hidden-xs-only" src="/favicon.png" @click="goIndex()"></ElImage>
                    <ElMenuItem class="menu-item hidden-xs-only" index="/mooc">Mooc</ElMenuItem>
                    <ElMenuItem class="menu-item hidden-xs-only" index="/video">Video</ElMenuItem>

                    <ElImage class="icon small hidden-sm-and-up" src="/favicon.png" @click="goIndex()"></ElImage>
                    <ElMenuItem class="menu-item small hidden-sm-and-up" index="/mooc">Mooc</ElMenuItem>
                    <ElMenuItem class="menu-item small hidden-sm-and-up" index="/video">Video</ElMenuItem>
                </ElMenu>
                <div class="nav-center">
                    <RouterView name="header" />
                </div>
                <ElSpace class="nav-end" :size="spaceCount()">
                    <ElSwitch v-model="isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" :style="themeStyle"
                        class="theme-switch"></ElSwitch>
                    <ElIcon :color="color[githubBtnColor % 2]" @click="openGithub" @mouseenter="githubBtnColor++"
                        @mouseleave="githubBtnColor++" style="cursor: pointer" class="github-icon">
                        <Github />
                    </ElIcon>
                    <ElAvatar class="avatar" :size="25" src="/headicon.png"></ElAvatar>
                </ElSpace>
            </ElSpace>
        </ElHeader>
        <ElMain class="main">
            <Suspense>
                <RouterView />
            </Suspense>
        </ElMain>
    </ElContainer>
</template>

<style scoped>
.header {
    height: 50px;
    padding: 0;
    border-bottom: 1px solid var(--el-border-color-light);
    background-color: var(--el-bg-color);
}

@media only screen and (max-width: 768px) {
    .header {
        height: 40px;
    }

    .nav-start {
        height: 40px !important;
    }

    .menu-item.small {
        padding: 0 8px;
        font-size: 13px;
    }

    .icon.small {
        height: 20px;
        width: 20px;
        margin: 10px 16px 10px 16px;
    }

    .github-icon {
        font-size: 26px !important;
    }

    .avatar {
        height: 22px;
        width: 22px;
    }
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

.github-icon {
    font-size: 30px;
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
