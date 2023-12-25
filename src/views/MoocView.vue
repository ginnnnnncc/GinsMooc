<script setup lang="ts">
import { watch, type Ref } from "vue"
import type { course, test } from "@/type/mooc"
import { ref, computed } from "vue"
import { MoocAside } from "@/views"
import { useRoute } from "vue-router"
import { Menu, Search, ArrowLeftBold } from "@element-plus/icons-vue"
import router from "@/router"

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
        ; (<HTMLElement>item).click()
    }
}
const onCourseBack = () => router.push({ path: `/mooc/course/${currentCourse.value.id}` })
const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]
const [menuBtnColor, backBtnColor] = [ref(0), ref(0)]

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
                <ElHeader class="mooc-main-header">
                    <ElIcon :color="color[menuBtnColor % 2]" :size="22" @click="aside?.showDrawer"
                        @mouseenter="menuBtnColor++" @mouseleave="menuBtnColor++"
                        :style="emptyContent ? 'display: none;' : ''" class="hidden-xl-only hidden-md-only icon-btn">
                        <Menu></Menu>
                    </ElIcon>
                    <ElIcon :color="color[backBtnColor % 2]" :size="20" @click="onCourseBack"
                        v-if="currentTest && currentTest.name" @mouseenter="backBtnColor++" @mouseleave="backBtnColor++"
                        class="icon-btn">
                        <ArrowLeftBold />
                    </ElIcon>
                    <span style="flex: 1" class="mooc-header-title">
                        <span :class="{ 'hidden-xs-only': currentTest && currentTest.name }"
                            v-if="currentCourse && currentCourse.name">{{ currentCourse.name }}</span>
                        <template v-if="currentTest && currentTest.name">
                            <span class="hidden-xs-only"> - </span>
                            <span>{{ currentTest.name }}</span>
                        </template>
                    </span>
                    <template v-if="currentTest && currentTest.objective">
                        <ElInput v-model="quizQuery" :suffix-icon="Search" placeholder="按题目搜索，图片以“【图片】”代替"
                            style="width: 400px" class="hidden-xs-only"></ElInput>
                        <ElButton class="display-answer hidden-xs-only" type="primary" round plain @click="setAllAnswer"
                            style="margin-left: 16px">显示答案</ElButton>
                    </template>
                </ElHeader>
                <div class="hidden-sm-and-up small-function-bar" v-if="currentTest && currentTest.objective">
                    <ElInput v-model="quizQuery" :suffix-icon="Search" placeholder="按题目搜索，图片以“【图片】”代替" style="width: 400px"
                        size="small"></ElInput>
                    <ElButton class="display-answer" type="primary" round plain @click="setAllAnswer"
                        style="margin-left: 16px" size="small">显示答案</ElButton>
                </div>
                <div class="split-line hidden-sm-and-up"></div>
                <ElMain class="mooc-main-body" style="height: calc(100vh - 100px)">
                    <RouterView :update-current-test="updateCurrentTest" :update-current-course="updateCurrentCourse"
                        :search="quizQuery"></RouterView>
                </ElMain>
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
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: var(--el-bg-color);
    font-weight: 700;
    font-size: 18px;
    color: var(--el-text-color-primary);
}

@media only screen and (max-width: 768px) {
    .mooc-main-header {
        height: 40px;
        padding: 0 16px;
        font-size: 16px;
    }
}

.mooc-header-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.small-function-bar {
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: white;
    height: 42px;
}

.split-line {
    border-bottom: 1px solid var(--el-border-color-extra-light);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
}

.mooc-main-header .display-answer {
    transition: all var(--el-transition-duration);
}

.mooc-main-body {
    padding: 0;
    background-color: var(--el-fill-color-light);
    overflow: hidden;
}

.icon-btn {
    cursor: pointer;
    padding-right: 8px;
}
</style>
