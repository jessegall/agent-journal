<script setup>
import {inject} from "vue";
import Btn from "../src/kit/Btn.vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

// the tabs a window declares in the backend, each with the count from the last answer the window read; choosing one is the window's to read
defineProps({active: {type: Object, default: null}, answer: {type: Object, default: () => ({})}});
const emit = defineEmits(["choose"]);
const tabs = inject(WINDOW_CONTEXT, null)?.tabs ?? [];
</script>

<template>
    <div class="inner-tabs" data-inner-tabs>
        <template v-for="tab in tabs" :key="tab.key">
            <Btn kind="text" :class="['inner-tab', {on: active?.key === tab.key}]" :data-tab="tab.key" @click="emit('choose', tab)">{{ tab.label }} {{ answer[tab.count_field] }}</Btn>
        </template>
    </div>
</template>

<style scoped>
.inner-tabs {
    display: flex;
    gap: 14px;
}

.inner-tab {
    padding: 0 0 4px;
    border: 0;
    border-bottom: 1px solid transparent;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.inner-tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}
</style>
