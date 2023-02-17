<script setup lang="ts">
import { ref } from "vue"
import { useApiAccess } from "@/plugins/apiAccess"

const props = defineProps<{
    setGamePassed: Function
}>()

const apiAccess = useApiAccess()
const info = (await apiAccess("getGameInfo")).data
const [passed, talented, guess] = [ref(info.passed), ref(info.talented), ref("0.500000")]
const [reward, state] = [ref(false), ref("")]
let [low, high] = [0.0, 1.0]
const submitDisable = ref(false)

const onGuessInput = () => {
    guess.value = guess.value.replace(/([^\d.])|(^[^01])/, "")
    submitDisable.value = !/^(0+|1(\.0+)?|0\.[0-9]+)$/.test(guess.value)
}
const onSubmmitClick = async () => {
    reward.value = false
    const {
        info,
        state: { less, more, reward: rewardText }
    } = (await apiAccess("guessGame", undefined, { guess: guess.value })).data
    passed.value = info.passed
    talented.value = info.talented
    if (less) {
        low = parseFloat(guess.value)
        state.value = "less"
    } else if (more) {
        high = parseFloat(guess.value)
        state.value = "more"
    } else {
        ;[low, high] = [0.0, 1.0]
        state.value = "correct"
        if (rewardText) {
            reward.value = true
            props.setGamePassed("guess", "guess")
        }
    }
    guess.value = (Math.round(((low + high) * 1000000) / 2) / 1000000).toFixed(6)
}
const onRefreshClick = async () => {
    ;[low, high] = [0.0, 1.0]
    guess.value = "0.500000"
    reward.value = false
    await apiAccess("refreshGameNumber")
}
</script>

<template>
    <div class="game">
        <div class="game-title">猜大小</div>
        <div class="game-desc">
            
        </div>
        <div class="game-info">你目前已经猜对了 {{ passed }} 次，其中 {{ talented }} 次是一次性猜对的。</div>
        <ElDivider></ElDivider>
        <div class="game-body">
            <ElInput
                v-model="guess"
                style="margin-right: 12px; width: 250px"
                placeholder="尝试猜测一个0-1的数字吧"
                maxlength="8"
                @input="onGuessInput"
            ></ElInput>
            <ElButton type="primary" :disabled="submitDisable" @click="onSubmmitClick">提交</ElButton>
            <ElButton type="danger" @click="onRefreshClick">重置</ElButton>
        </div>
        <div class="game-tips">
            <span class="warning" v-if="state === 'less'">数字太<strong class="danger">小</strong>了！再试一次吧！</span>
            <span class="warning" v-else-if="state === 'more'">数字太<strong class="danger">大</strong>了！再试一次吧！</span>
            <span class="success" v-else-if="state === 'correct'">答对了！试试下一个数字吧！</span>
        </div>
        <div class="game-reward" v-if="reward">恭喜你通过本关！</div>
    </div>
</template>

<style scoped>
.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1000px;
    color: var(--el-text-color-primary);
    line-height: 1.5;
}
.game-title {
    font-size: 32px;
    font-weight: 700;
}
.game-body {
    display: flex;
    flex-direction: row;
}
.game-tips .warning {
    color: var(--el-color-warning);
}
.game-tips .success {
    color: var(--el-color-success);
}
.game-tips .danger {
    color: var(--el-color-danger);
}
.copyright {
    margin-left: 16px;
    display: flex;
    align-items: center;
    color: var(--el-text-color-regular);
}
</style>
