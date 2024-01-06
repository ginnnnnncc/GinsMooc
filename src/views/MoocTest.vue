<script setup lang="ts">
import { watch, ref } from "vue"
import { useApiAccess } from "@/plugins/apiAccess"
import { QuestionCard } from "@/components"
import { useRoute, useRouter } from "vue-router"
import type { homework, quiz } from "@/type/mooc"
import { ElMessage } from "element-plus"

interface question {
    data: quiz | homework
    order: number
}

const props = defineProps<{
    tid: number | string
    updateCurrentTest: Function
    updateCurrentCourse: Function
    search: string
}>()

const [apiAccess, route, router] = [useApiAccess(), useRoute(), useRouter()]
const [left, right, all] = [ref(<question[]>new Array()), ref(<question[]>new Array()), ref(<question[]>new Array())]
let [leftLength, rightLength, nextPage, totalPages] = [0, 0, 0, 0]
const loading = ref(false)
const disabled = () => loading.value || nextPage >= totalPages

const loadData = async (tid: number | string = props.tid) => {
    if (!/[0-9]+/g.test(String(tid))) {
        ElMessage.error("id错误")
        router.replace({ name: "Home" })
    }
    loading.value = true
    const res = (await apiAccess("getTestDetail", { tid: tid, page: nextPage++, search: props.search }, undefined)).data
    const [course, test, questionList, total] = [res.course, res.test, res.questionList, res.totalPages]
    if (nextPage === 1) {
        totalPages = total
        props.updateCurrentTest(test)
        props.updateCurrentCourse(course)
    }
    questionList.forEach((value, index) => {
        const order = (nextPage - 1) * 30 + index + 1
        all.value.push({ data: value, order: order })
        if (leftLength <= rightLength) {
            leftLength += value.toString().length
            left.value.push({ data: value, order: order })
        } else {
            rightLength += value.toString().length
            right.value.push({ data: value, order: order })
        }
    })
    loading.value = false
}
defineExpose({ loadData })

loadData()

watch(
    () => route.params,
    async (toParams) => {
        if (toParams["tid"]) {
            loadData(<string>toParams["tid"])
        }
    }
)
watch(
    () => props.search,
    () => {
        [leftLength, rightLength, nextPage, totalPages] = [0, 0, 0, 0]
        left.value = new Array()
        right.value = new Array()
        all.value = new Array()
        loadData()
    }
)

var lastScrollTop = 0;
var moocHeader = document.getElementsByClassName('mooc-main-header').item(0) as HTMLElement;
var header = document.getElementsByClassName('header').item(0) as HTMLElement;

const scrollCallback = (arg: {scrollLeft: number, scrollTop: number}) => {
    if (window.innerWidth >= 768) return
    if (!moocHeader) moocHeader = document.getElementsByClassName('mooc-main-header').item(0) as HTMLElement
    if (!header) header = document.getElementsByClassName('header').item(0) as HTMLElement
    if (arg.scrollTop > lastScrollTop) {
        moocHeader.style.display = 'none';
        header.style.display = 'none';
    } else {
        moocHeader.style.display = 'flex';
        header.style.display = 'block';
    }
    lastScrollTop = arg.scrollTop;
}
</script>

<template>
    <ElScrollbar class="test-detail" :always="true" @scroll="scrollCallback" :noresize="true">
        <div v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled()" :infinite-scroll-distance="500">
            <ElRow :gutter="20" style="margin: 0 10px 20px 10px" class="hidden-md-and-down">
                <ElCol :span="12">
                    <QuestionCard v-for="question in left" :data="question.data" :order="question.order"></QuestionCard>
                </ElCol>
                <ElCol :span="12">
                    <QuestionCard
                        v-for="question in right"
                        :data="question.data"
                        :order="question.order"
                    ></QuestionCard>
                </ElCol>
            </ElRow>
            <ElCol class="hidden-lg-and-up question-card-small">
                <QuestionCard v-for="question in all" :data="question.data" :order="question.order"></QuestionCard>
            </ElCol>
        </div>
    </ElScrollbar>
</template>

<style scoped>
.test-detail {
    padding-right: 6px;
}

.question-card-small {
    margin: 0 20px 20px 20px
}

@media only screen and (max-width: 768px) {
    .question-card-small {
        margin: 0 0;
    }
}
</style>
