<script setup>
import {computed} from "vue";
import ChatMark from "../kit/ChatMark.vue";
import Icon from "../kit/Icon.vue";
import {announce} from "./announce.js";
import {tick} from "./haptic.js";

const props = defineProps({item: {type: Object, required: true}});
const mark = computed(() => {
    const {icon, tone, color, label, name, detail, card, state, command, created} = props.item;
    return {icon, tone, color, label: name ? `${label} **${name}**` : label, detail, card, state, command, at: created};
});

async function copied() {
    try {
        await navigator.clipboard.writeText(props.item.command);
        tick();
        announce("Command copied");
    } catch (error) {
        announce("The command could not be copied");
    }
}
</script>

<template>
    <div :class="['phone-mark', {console: item.command}]">
        <ChatMark :mark="mark" />
        <template v-if="item.command">
            <button type="button" class="mark-copy" aria-label="Copy the command" @click="copied">
                <Icon name="copy" :size="14" />
            </button>
        </template>
    </div>
</template>

<style scoped>
.phone-mark {
    position: relative;
    max-width: 100%;
}

.phone-mark.console {
    width: 100%;
}

.phone-mark.console :deep(.mark) {
    display: grid;
    width: 100%;
    font-size: 0.706rem;
}

.phone-mark.console :deep(.head) {
    justify-content: center;
}

.phone-mark :deep(.command) {
    display: block;
    grid-column: 1 / -1;
    max-width: 100%;
    margin-top: 2px;
    padding: 6px 36px 6px 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    border-radius: 6px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.706rem;
    line-height: 1.5;
    text-align: left;
    white-space: pre;
    word-break: normal;
    -webkit-overflow-scrolling: touch;
}

.phone-mark :deep(.card) {
    text-align: left;
}

.mark-copy {
    position: absolute;
    right: 6px;
    bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin: -10px -6px -8px 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
}
</style>
