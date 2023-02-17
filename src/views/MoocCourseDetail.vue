<script setup lang="ts">
import type { test } from "@/type/mooc"
import { watch, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useApiAccess } from "@/plugins/apiAccess"
import { ElMessage } from "element-plus";

const props = defineProps<{
    cid: number | string
    updateCurrentCourse: Function
    updateCurrentTest: Function
}>()

const [apiAccess, route, router] = [useApiAccess(), useRoute(), useRouter()]
const data = ref(<test[][]>new Array())

const courseDetailSetup = async (cid: number | string) => {
    if (!/[0-9]+/g.test(String(cid))) {
        ElMessage.error("id错误")
        router.replace({ name: "Home" })
    }
    const res = (await apiAccess("getCourseDetail", { cid }, undefined)).data
    const [testList, course] = [res.testList, res.course]
    props.updateCurrentCourse(course)
    props.updateCurrentTest(null)
    const len = testList.length
    let chapterIndex = -1
    data.value.length = 0
    for (let i = 0; i < len; i++) {
        if (i === 0 || testList[i].chapterId !== testList[i - 1].chapterId) {
            chapterIndex++
            data.value.push(new Array())
        }
        data.value[chapterIndex].push(testList[i])
    }
}

courseDetailSetup(props.cid)

watch(
    () => route.params,
    async (toParams) => {
        if (toParams["cid"]) {
            courseDetailSetup(<string>toParams["cid"])
        }
    }
)

const onTestClick = (test: test) => router.push({ path: `/mooc/test/${test.id}` })
</script>

<template>
    <ElScrollbar v-if="data" class="course-detail" :always="true">
        <div class="chapter" v-for="chapter in data">
            <div class="chapter__title">{{ chapter[0].chapterName }}</div>
            <div class="chapter__detail">
                <div class="test" v-for="test in chapter">
                    <ElLink class="test__title" :underline="false" @click="onTestClick(test)">{{ test.name }}</ElLink>
                    <ElTag class="test__release-time" type="success">{{ test.releaseTime }}</ElTag>
                    <ElTag class="test__deadline" type="danger">{{ test.deadline }}</ElTag>
                </div>
            </div>
        </div>
    </ElScrollbar>
</template>

<style scoped>
.course-detail {
    margin: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
}
.chapter {
    max-width: 900px;
    margin: 40px 0 0 40px;
    padding-right: 40px;
    color: var(--el-text-color-primary);
}
.chapter:last-child {
    margin-bottom: 40px;
}
.chapter__title {
    padding-left: 8px;
    border-bottom: 1px solid var(--el-border-color);
    font-size: 18px;
    line-height: 1.5;
}
.chapter__detail {
    padding: 0 20px 0 40px;
}
.test {
    margin-top: 12px;
    line-height: 28px;
    vertical-align: middle;
}
.test__title {
    font-size: 16px;
    margin-bottom: 4px;
    transition: all 0.2s;
    line-height: 1.5;
}
.test__release-time {
    margin-left: 20px;
}
.test__deadline {
    margin-left: 12px;
}
.test__release-time,
.test__deadline {
    transition: all 0s;
}
</style>
