<script setup lang="ts">
import { watch, type Ref } from "vue"
import type { course, test } from "@/type/mooc"
import { ref, computed } from "vue"
import { MoocAside } from "@/views"
import { useRoute } from "vue-router"
import { Menu, Search } from "@element-plus/icons-vue"

const currentCourse: Ref<course> = ref(<course>new Object())
const currentTest: Ref<test> = ref(<test>new Object())
const route = useRoute()
const aside = ref()
const quizQuery = ref("")

const mainHeaderTitle = computed(() => {
    let ret = ""
    if (currentCourse.value && currentCourse.value.name) {
        ret += currentCourse.value.name
    }
    if (currentTest.value && currentTest.value.name) {
        ret += ret ? " - " : ""
        ret += currentTest.value.name
    }
    return ret
})
const emptyContent = computed(() => !(currentCourse.value.id || currentTest.value.id))

const updateCurrentCourse = (course: course) => (currentCourse.value = course)
const updateCurrentTest = (test: test) => (currentTest.value = test)
const setAllAnswer = () => {
    const questions = <HTMLCollection>document.getElementsByClassName("question-card-header")
    for (const item of questions) {
        ;(<HTMLElement>item).click()
    }
}
const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const menuBtnColor = ref(0)

watch(
    () => route.params,
    (toParams) => {
        if (toParams["cid"] === undefined && toParams["tid"] === undefined) {
            updateCurrentCourse(<course>new Object())
            updateCurrentTest(<test>new Object())
        }
        quizQuery.value = ""
    }
)
</script>

<template>
    <ElContainer>
        <ElAside class="mooc-aside" width="355px" :class="emptyContent ? '' : 'hidden-lg-only hidden-sm-and-down'">
            <Suspense>
                <MoocAside :current-course="currentCourse" ref="aside"></MoocAside>
            </Suspense>
        </ElAside>
        <ElMain class="mooc-main">
            <ElContainer>
                <ElHeader class="mooc-main-header" height="50px">
                    <ElIcon
                        :color="color[menuBtnColor % 2]"
                        :size="22"
                        @click="aside?.showDrawer"
                        @mouseenter="menuBtnColor++"
                        @mouseleave="menuBtnColor++"
                        style="cursor: pointer; padding-right: 8px;"
                        :style="emptyContent ? 'display: none;' : ''"
                        class="hidden-xl-only hidden-md-only"
                    >
                        <Menu></Menu>
                    </ElIcon>
                    <span style="flex: 1">{{ mainHeaderTitle }}</span>
                    <ElInput
                        v-if="currentTest && currentTest.objective"
                        v-model="quizQuery"
                        :suffix-icon="Search"
                        placeholder="按题目搜索，图片以“【图片】”代替"
                        style="width: 400px"
                    ></ElInput>
                    <ElButton
                        v-if="currentTest && currentTest.objective"
                        class="display-answer"
                        type="primary"
                        round
                        plain
                        @click="setAllAnswer"
                        style="margin-left: 16px"
                        >显示答案</ElButton
                    >
                </ElHeader>
                <ElMain class="mooc-main-body" style="height: calc(100vh - 100px)"
                    ><RouterView
                        :update-current-test="updateCurrentTest"
                        :update-current-course="updateCurrentCourse"
                        :search="quizQuery"
                    ></RouterView
                ></ElMain>
            </ElContainer>
        </ElMain>
    </ElContainer>
</template>

<style scoped>
.mooc-aside {
    border-right: 1px solid var(--el-border-color-light);
    overflow: hidden;
    background-color: var(--el-bg-color);
}
.mooc-main {
    padding: 0;
}
.mooc-main-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    background-color: var(--el-bg-color);
    font-weight: 700;
    font-size: 18px;
    color: var(--el-text-color-primary);
}
.mooc-main-header .display-answer {
    transition: all var(--el-transition-duration);
}
.mooc-main-body {
    padding: 0;
    background-color: var(--el-fill-color-light);
    overflow: hidden;
}
</style>
