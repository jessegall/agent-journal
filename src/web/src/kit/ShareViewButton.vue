<script setup>
import {onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import {copyText} from "../platform/clipboard.js";
import Icon from "./Icon.vue";

const props = defineProps({view: {type: String, required: true}, title: {type: String, required: true}});
const FLASH = 2000;
const state = ref("");
let timer = 0;

async function share() {
    try {
        state.value = (await copyText((await api.shareView(props.view)).abstract)) ? "copied" : "failed";
    } catch {
        state.value = "failed";
    }
    clearTimeout(timer);
    timer = setTimeout(() => (state.value = ""), FLASH);
}

onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <button type="button" :class="['share-view-button', state]" :title="state === 'copied' ? 'Link copied' : state === 'failed' ? 'The link could not be made' : title" @click="share">
        <Icon :name="state === 'copied' ? 'tick' : 'share'" :size="12" />
    </button>
</template>

<style scoped>
.share-view-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.share-view-button:hover,
.share-view-button.copied {
    color: var(--text);
}

.share-view-button.failed {
    color: var(--blocking);
}
</style>
