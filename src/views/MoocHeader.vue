<script setup lang="ts">
import { ref } from "vue"
import { Extension } from "@/components/icon"

const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const extensionBtnColor = ref(0)
const extensionDialogVisible = ref(false)
const extensionCollapseValue = ref("1")

const sizeCount = () => window.innerWidth < 768 ? 20 : 25
</script>

<template>
    <div class="mooc-header">
        <div class="mooc-notice"><span class="hidden-xs-only">页面已经悄悄地适配了移动端</span></div>
        <div class="mooc-function">
            <ElIcon :color="color[extensionBtnColor % 2]" :size="sizeCount()" @mouseenter="extensionBtnColor++"
                @mouseleave="extensionBtnColor++" @click="extensionDialogVisible = true" style="cursor: pointer;">
                <Extension style="margin: 0;" />
            </ElIcon>
        </div>
    </div>
    <ElDialog v-model="extensionDialogVisible">
        <template #header>GinsMooc Extension Helper</template>
        <ElCollapse accordion style="line-height: 1.5;" v-model="extensionCollapseValue">
            <ElCollapseItem title="简介" name="1">
                <p>实现对于中国大学MOOC的</p>
                <ul>
                    <li>非在线测评题的自动答案查询，包括单选题、多选题、判断题、填空题、简答题，支持测验与作业及考试</li>
                    <li>互评阶段的自动评分、自动点评</li>
                </ul>
                <p>下载地址：<ElLink href="/download/GinsMoocExtension_v2.0.8.zip">https://ginnnnnn.top/download/GinsMoocExtension_v2.0.8.zip
                    </ElLink>
                </p>
            </ElCollapseItem>
            <ElCollapseItem title="功能介绍" name="2">
                <p>在测试的准备页面，将会自动检查是否准备就绪，若为否将自动更新课程</p>
                <ElImage class="extension-image" src="/extension-updating.png"></ElImage>
                <p>进入测验后，将显示“获取答案”按钮，点击即可</p>
                <ElImage class="extension-image" src="/extension-single-choice.png"></ElImage>
                <ElImage class="extension-image" src="/extension-multiple-choice.png"></ElImage>
                <ElImage class="extension-image" src="/extension-completion.png"></ElImage>
                <ElImage class="extension-image" src="/extension-homework.png"></ElImage>
                <p>作业的互评阶段支持自动评分、自动点评</p>
                <ElImage class="extension-image" src="/extension-auto-evaluate-1.png"></ElImage>
                <ElImage class="extension-image" src="/extension-auto-evaluate-2.png"></ElImage>
            </ElCollapseItem>
            <ElCollapseItem title="安装介绍" name="3">
                <p>下载安装包后，将其解压至文件夹内</p>
                <p>在浏览器地址栏中输入edge://extensions（谷歌浏览器为chrome://extensions）</p>
                <p>打开开发者模式</p>
                <ElImage class="extension-image" src="/extension-developer-mode.png"></ElImage>
                <p>点击“加载解压缩的扩展”，选择刚刚解压到的文件夹，即可开始使用</p>
                <ElImage class="extension-image" src="/extension-load-decompression.png"></ElImage>
            </ElCollapseItem>
        </ElCollapse>
    </ElDialog>
</template>

<style scoped>
.mooc-header {
    display: flex;
    align-items: center;
}

.mooc-notice {
    flex: 1;
    text-align: center;
    color: var(--el-color-primary);
    font-size: 14px;
}

.mooc-function {
    flex: 0 !important;
    width: min-content;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
}

@media screen and (max-width: 768px) {
    .mooc-function {
        padding-right: 0;
    }
    
}

.extension-image {
    box-shadow: var(--el-box-shadow-light);
    margin: 8px 0;
}
</style>
