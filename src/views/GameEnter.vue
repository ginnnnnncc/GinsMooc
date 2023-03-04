<script setup lang="ts">
import { ElMessage } from "element-plus"
import { ref } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
    setGamePassed: Function
}>()

const router = useRouter()
const answer = ref("")
const onSubmmitClick = () => {
    if (answer.value === "We1cOme_T0_ctf!") {
        props.setGamePassed("enter", "guess")
        ElMessage.success("恭喜你回答正确，快去往下一关吧")
    } else {
        ElMessage.error("回答错误，再尝试一下吧")
    }
}
const openArcaea = () => window.open("/Arcaea_2-1.png")
</script>

<template>
    <div class="game">
        <div class="game-title">趣味小游戏</div>
        <div class="game-desc">
            <p>最近gin学习了该如何表示二进制数据，然而他怎么看都看不懂</p>
            <p>他的好朋友amazingF却一点都不同情他，还温馨（kě wù）地出了一道题来考他</p>
            <p>愚蠢的小g一点头绪都没有，你能帮帮他吗？</p>
            <p style="padding-top: 24px">
                完成后他就会带你前往下一个关卡，在那里，你有机会获取到神圣的<span style="color: var(--el-color-danger)"
                    >记忆源点</span
                >
            </p>
            <p>当然，你也可以尝试直接寻找它的入口与进入条件</p>
            <ElImage
                src="/Arcaea_2-1.png"
                style="margin-top: 24px; width: 900px; cursor: pointer"
                @click="openArcaea"
            ></ElImage>
        </div>
        <ElDivider></ElDivider>
        <div class="game-body">
            <div class="token">
                Wzg3LCAxMDEsIDQ5LCA5OSwgNzksIDEwOSwgMTAxLCA5NSwgODQsIDQ4LCA5NSwgOTksIDExNiwgMTAyLCAzM10
            </div>
            <div>
                <ElInput
                    v-model="answer"
                    class="game-input"
                    placeholder="提示：答案应是一行有意义的英文"
                    style="margin-right: 12px; width: 250px"
                ></ElInput>
                <ElButton class="game-submit" type="primary" :disabled="true" @click="onSubmmitClick">确认</ElButton>
            </div>
        </div>
    </div>
</template>

<style>
.game {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1000px;
    color: var(--el-text-color-primary);
    line-height: 1.5;
    text-align: center;
}
.game-title {
    font-size: 32px;
    font-weight: 700;
}
.game-desc {
    margin-top: 32px;
}
.game-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 50px;
}
.game-body .token {
    margin-bottom: 24px;
    max-width: 700px;
    word-wrap: break-word;
}
</style>
