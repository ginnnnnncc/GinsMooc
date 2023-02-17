<script setup lang="ts">
import { ref, computed } from "vue"
const apiList = [
    { name: "JSONPlayer【有弹幕】", url: "https://jx.bozrc.com:4433/player/?url=" },
    { name: "CKPlayer", url: "https://www.ckplayer.vip/jiexi/?url=" },
    { name: "盘古", url: "https://www.pangujiexi.cc/jiexi.php?url=" },
    { name: "老板", url: "https://vip.laobandq.com/jiexi.php?url=" },
    { name: "OK", url: "https://okjx.cc/?url=" },
    { name: "8090", url: "https://www.8090.la/8090/?url=" },
    { name: "维多", url: "http://jx.ivito.cn/?url=" },
    { name: "CKMOV", url: "https://www.ckmov.vip/api.php?url=" },
    { name: "BL解析", url: "https://svip.bljiex.cc/?v=" },
    { name: "1717", url: "https://www.1717yun.com/1717yun/?url=" },
    { name: "M3U8", url: "https://dmjx.m3u8.tv/?url=" },
    { name: "云解析", url: "http://jx.ppflv.com/?url=" },
    { name: "虾米解析", url: "https://jx.xmflv.com/?url=" },
    { name: "JYPlayer", url: "https://jx.playerjy.com/?url=" }
]
const [apiUrl, videoUrl] = [ref(localStorage.getItem("GinsVideo-apiUrl")), ref("")]
const src = computed(() => apiUrl.value + videoUrl.value)
const setApiUrl = (url: string) => {
    localStorage.setItem("GinsVideo-apiUrl", url)
    apiUrl.value = url
}
</script>

<template>
    <ElContainer>
        <ElAside class="video-aside" width="305px">
            <ElScrollbar class="api-list">
                <div
                    class="api-item"
                    :class="{ 'is-selected': apiUrl === api.url }"
                    v-for="api in apiList"
                    @click="setApiUrl(api.url)"
                >
                    {{ api.name }}
                </div>
            </ElScrollbar>
        </ElAside>
        <ElMain class="video-main">
            <ElInput v-model="videoUrl" class="video-input" size="large" placeholder="将视频地址复制到这里"></ElInput>
            <iframe
                v-if="apiUrl && videoUrl"
                :src="src"
                height="675px"
                width="1575px"
                frameborder="0"
                allowfullscreen="true"
            ></iframe>
            <ElEmpty v-else class="video-mask" description="您还未选择接口或输入视频地址"></ElEmpty>
            <div class="disclaimers">
                <span>本系统只为内部交流学习，不以盈利为目的</span>
                <span>所有资源均来源第三方资源，并不提供影片资源存储，录制、上传相关视频等，视频版权归属其合法持有人所有，本站不对使用者的行为负担任何法律责任</span>
                <span>如果有因为本站而导致您的权益受到损害，请与我们联系，我们将理性对待，协助你解决相关问题</span>
            </div>
        </ElMain>
    </ElContainer>
</template>

<style scoped>
.video-aside {
    border-right: 1px solid var(--el-border-color-light);
    overflow: hidden;
    background-color: var(--el-bg-color);
    padding: 8px;
}
.video-main {
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
}
.video-input {
    margin-bottom: 20px;
}
.video-mask {
    padding: 0;
    height: 675px;
    width: 1575px;
    background-color: var(--el-empty-fill-color-3);
}
.api-item {
    padding: 8px 16px;
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 1.5;
    border-radius: 8px;
    background-color: var(--el-color-primary-light-8);
    color: var(--el-menu-text-color);
    transition: all 0.2s;
    cursor: pointer;
}
.api-item:not(.is-selected):hover,
.api-item.is-selected {
    background-color: var(--el-color-primary-light-5);
}
.api-item:active {
    transform: scale(0.98);
}
.disclaimers {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20px;
    line-height: 1.5;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}
</style>
