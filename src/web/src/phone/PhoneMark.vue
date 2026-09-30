<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";

const props = defineProps({item: {type: Object, required: true}});
const label = computed(() => (props.item.name ? `${props.item.label} **${props.item.name}**` : props.item.label));
</script>

<template>
    <ChatMark
        :icon="item.icon"
        :tone="item.tone"
        :color="item.color"
        :label="label"
        :detail="item.detail"
        :card="item.card"
        :state="item.state"
        :command="item.command"
        :at="item.created"
    />
</template>

<style scoped>
.mark.console {
    display: grid;
    width: 100%;
    text-align: left;
}

.mark.console :deep(.command) {
    display: block;
    grid-column: 1 / -1;
    max-width: 100%;
    margin-top: 4px;
    padding: 6px 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    border-radius: 8px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.706rem;
    line-height: 1.5;
    text-align: left;
    white-space: pre;
    word-break: normal;
    -webkit-overflow-scrolling: touch;
}

.mark :deep(.card) {
    text-align: left;
}
</style>
