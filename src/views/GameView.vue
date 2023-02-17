<script setup lang="ts">
import { watch } from "vue"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { GameEnter, GameGuess } from "."

const [route, router] = [useRoute(), useRouter()]
const game = ref("")
const gameList = ["enter", "guess"]
const setProperGame = (name: string) => {
    const json = localStorage.getItem("GinsGame-passed")
    if (!json) {
        localStorage.setItem("GinsGame-passed", "[]")
        return (game.value = "enter")
    }
    const data = <Array<string>>JSON.parse(json)
    for (const item of gameList) {
        if (item === name || !data.includes(item)) {
            return (game.value = item)
        }
    }
    game.value = gameList[gameList.length - 1]
}
const setGamePassed = (passed: string, next: string) => {
    const json = localStorage.getItem("GinsGame-passed")
    if (!json) {
        localStorage.setItem("GinsGame-passed", JSON.stringify([passed]))
    } else {
        const data = <Array<string>>JSON.parse(json)
        if (data.indexOf(passed) === -1) {
            data.push(passed)
            localStorage.setItem("GinsGame-passed", JSON.stringify(data))
        }
    }
    router.push({ path: `/game/${next}` })
}

setProperGame(<string>route.params["game"])

watch(
    () => route.params,
    (toParams) => {
        if (toParams["game"]) {
            setProperGame(<string>toParams["game"])
        }
    }
)
</script>

<template>
    <GameEnter v-if="game === 'enter'" :set-game-passed="setGamePassed"></GameEnter>
    <GameGuess v-else-if="game === 'guess'" :set-game-passed="setGamePassed"></GameGuess>
</template>

<style></style>
