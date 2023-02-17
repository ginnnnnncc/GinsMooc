import { createRouter, createWebHistory } from "vue-router"
import { HomeView, GameView, MoocView, MoocHeader, MoocCourseDetail, MoocTest, VideoView } from "@/views"
import { ElMessage } from "element-plus"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            meta: { title: "Gins" },
            component: HomeView
        },
        {
            path: "/video",
            name: "Video",
            meta: { title: "GinsVideo" },
            component: VideoView
        },
        {
            path: "/mooc",
            name: "Mooc",
            components: {
                default: MoocView,
                header: MoocHeader
            },
            meta: { title: "GinsMooc" },
            children: [
                { path: "course/:cid", name: "MoocCourse", component: MoocCourseDetail, props: true },
                { path: "test/:tid", name: "MoocTest", component: MoocTest, props: true }
            ]
        },
        {
            path: "/game/:game",
            name: "Game",
            meta: { title: "GinsGame" },
            component: GameView,
            props: true
        }
    ]
})

router.beforeEach((to, from) => {
    if (!to.name) {
        ElMessage.error("路由错误")
        return { name: "Home" }
    }
    if (to.meta.title) {
        document.title = <string>to.meta.title
    }
    return true
})

export default router

const checkMoocItemId = (id: string) => /[0-9]/.test(id)