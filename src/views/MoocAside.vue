<script setup lang="ts">
import type { course } from "@/type/mooc"
import type { courseList } from "@/type/api"
import { ref, watch } from "vue"
import { useApiAccess } from "@/plugins/apiAccess"
import { Plus, Search } from "@element-plus/icons-vue"
import { CourseCard } from "@/components"
import { sleep } from "@/plugins/tool"
import { useDark } from "@vueuse/core"
import router from "@/router"
import { ElScrollbar } from 'element-plus'

const isDark = useDark()
const apiAccess = useApiAccess()
const props = defineProps<{
    currentCourse: course
}>()
const drawerVisible = ref(false)
const data = ref(<course[]>[])
const query = ref("")
const refresh = ref(false)
const clicked = ref(false)
const cidCourseLoading = ref(false)

const showDrawer = () => (drawerVisible.value = true)
defineExpose({ showDrawer })
const defaultColor = "var(--el-color-primary-dark-2)"
const hoverColor = "var(--el-color-primary)"
const color = [defaultColor, hoverColor]

const newCourseId = ref("")
const newCourseState = ref(-1)
const newCourseBtnColor = ref(0)
const newCourseDialogVisible = ref(false)
const newCourseDialogLocked = ref(false)

const onNewCourseIdInput = () => (newCourseId.value = newCourseId.value.replace(/[^0-9]/g, ""))
const onNewCourseClick = async () => {
    let status
    newCourseDialogLocked.value = true
    while (true) {
        const res = await apiAccess("addCourse", { cid: newCourseId.value }, undefined)
        status = res.status
        const state = res.data
        if (state) {
            newCourseState.value = Math.round((state.finished / state.total) * 100)
        }
        if (newCourseState.value === 100) {
            break
        }
        await sleep(500)
    }
    newCourseDialogLocked.value = false
    newCourseState.value = -1
    newCourseId.value = ""
    newCourseDialogVisible.value = false
    if (status === 200) {
        refresh.value = true
        loadData()
    }
}
const onCourseClick = (course: course) => {
    clicked.value = true
    router.push({ path: `/mooc/course/${course.id}` })
    drawerVisible.value = false
}

watch(
    () => query.value,
    () => {
        refresh.value = true
        loadData()
    }
)

watch(
    () => props.currentCourse?.id,
    () => {
        if (!clicked.value) {
            refresh.value = true
            loadData(props.currentCourse?.id)
        }
    }
)

let [currentPage, totalPages] = [[0, -1], 0]
const loading = ref(false)
const disabled = () => loading.value || currentPage[1] >= totalPages - 1
const scrollbarRef1 = ref<InstanceType<typeof ElScrollbar>>()
const scrollbarRef2 = ref<InstanceType<typeof ElScrollbar>>()

const loadData = async (cid?: number, up?: boolean) => {
    const scrollTop = (value: number) => {
        scrollbarRef1.value && scrollbarRef1.value.setScrollTop(value)
        scrollbarRef2.value && scrollbarRef2.value.setScrollTop(value)
    }
    
    if (cid) {
        cidCourseLoading.value = true
    }
    loading.value = true
    const res = (await apiAccess("getCourseList", cid ? { cid } : { page: up ? --currentPage[0] : ++currentPage[1], search: query.value }, undefined)).data
    loading.value = false
    if (!cid && cidCourseLoading.value) {
        return
    }

    if (refresh.value) {
        data.value = res.courseList
        refresh.value = false
        currentPage = [res.currentPage, res.currentPage]
    } else if (up) {
        data.value = res.courseList.concat(data.value)
        currentPage[0] = res.currentPage
    } else {
        data.value = data.value.concat(res.courseList)
        currentPage[1] = res.currentPage
    }

    if (cid) {
        cidCourseLoading.value = false
        const order = data.value.findIndex((course) => course.id === cid)
        order !== -1 && scrollTop(order * 92)
    } else if (refresh.value) {
        scrollTop(0)
    }
    totalPages = res.totalPages
}

let courseListAside = document.querySelectorAll('.course-list .el-scrollbar__view')
const scrollCallback = (arg: { scrollLeft: number, scrollTop: number }) => {
    if (courseListAside.length === 0) {
        courseListAside = document.querySelectorAll('.course-list .el-scrollbar__view')
    }
    courseListAside.forEach((value) => {
        if (!loading.value && currentPage[0] > 0 && value.getBoundingClientRect().top > -500) {
            loadData(undefined, true)
        }
    })
}

loadData(props.currentCourse?.id)
</script>

<template>
    <ElContainer>
        <ElMain class="aside-main">
            <ElScrollbar v-if="data" class="course-list" ref="scrollbarRef1" :noresize="true" @scroll="scrollCallback">
                <div v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled()" :infinite-scroll-distance="500"
                    :infinite-scroll-immediate="false">
                    <CourseCard v-for="course in data" :key="course.id" :course="course"
                        :class="{ 'is-selected': currentCourse && course.id === currentCourse.id }"
                        @click="onCourseClick(course)"></CourseCard>
                </div>
            </ElScrollbar>
        </ElMain>
        <ElFooter class="aside-footer" height="50px">
            <ElIcon :size="20" @click="newCourseDialogVisible = true" style="cursor: pointer" class="new-course-btn"
                :color="color[newCourseBtnColor % 2]" @mouseenter="newCourseBtnColor++" @mouseleave="newCourseBtnColor++">
                <Plus />
            </ElIcon>
            <ElInput v-model="query" :suffix-icon="Search" placeholder="按课程名或学校搜索"></ElInput>
        </ElFooter>
    </ElContainer>
    <ElDrawer v-model="drawerVisible" :show-close="false" title="课程列表" :lock-scroll="false" direction="ltr"
        class="aside-drawer" :append-to-body="true">
        <ElScrollbar v-if="data" class="course-list" ref="scrollbarRef2">
            <div v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled()" :infinite-scroll-distance="500">
                <CourseCard v-for="course in data" :key="course.id" :course="course"
                    :class="{ 'is-selected': currentCourse && course.id === currentCourse.id }"
                    @click="onCourseClick(course)"></CourseCard>
            </div>
        </ElScrollbar>
        <template #footer>
            <ElIcon :size="20" @click="newCourseDialogVisible = true" style="cursor: pointer" class="new-course-btn"
                :color="color[newCourseBtnColor % 2]" @mouseenter="newCourseBtnColor++" @mouseleave="newCourseBtnColor++">
                <Plus />
            </ElIcon>
            <ElInput v-model="query" :suffix-icon="Search" placeholder="按课程名或学校搜索"></ElInput>
        </template>
    </ElDrawer>
    <ElDialog v-model="newCourseDialogVisible" :close-on-click-modal="!newCourseDialogLocked"
        :close-on-press-escape="!newCourseDialogLocked" :show-close="!newCourseDialogLocked">
        <template #header><span>添加新课程</span></template>
        <ElRow :gutter="16">
            <ElCol :span="6">
                <ElInput v-model="newCourseId" placeholder="在此输入课程id" maxlength="10" @input="onNewCourseIdInput"
                    :disabled="newCourseDialogLocked"></ElInput>
            </ElCol>
            <ElCol :span="2">
                <ElButton type="primary" @click="onNewCourseClick" :disabled="newCourseDialogLocked">确认</ElButton>
            </ElCol>
            <ElCol :span="16" v-if="newCourseDialogLocked">
                <ElProgress :text-inside="true" :stroke-width="32" :percentage="newCourseState" status="success">
                </ElProgress>
            </ElCol>
        </ElRow>
        <ElImage src="/new-course-help.png" style="margin-top: 8px; box-shadow: var(--el-box-shadow-light)"></ElImage>
    </ElDialog>
</template>

<style scoped>
.aside-header {
    color: var(--el-text-color-primary);
    padding: 0;
}

.aside-main {
    padding: 16px 0 16px 16px;
    overflow: hidden;
}

.course-list {
    padding-right: 16px;
}

.aside-header-img {
    width: 355px;
    cursor: pointer;
}

.aside-footer {
    display: flex;
    align-items: center;
    padding: 15px 16px;
    border-top: 1px solid var(--el-border-color-light);
}

.new-course-btn {
    margin-right: 16px !important;
}
</style>

<style>
.course-card.is-selected {
    position: sticky;
    top: 0;
    bottom: 0;
}

.aside-drawer {
    width: 355px !important;
}

.aside-drawer .el-drawer__body {
    padding: 16px;
}

.aside-drawer .el-drawer__footer {
    padding: 15px 16px;
    display: flex;
    align-items: center;
}
</style>
