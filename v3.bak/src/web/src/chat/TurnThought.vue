<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import ReplyTool from "./ReplyTool.vue";
import {useTurnLinks} from "./turnLinks.js";
import {useTurnText} from "./turnText.js";

const props = defineProps({turn: {type: Object, required: true}});
const emit = defineEmits(["reply"]);
const {env} = useTurnLinks();
const {words} = useTurnText(() => props.turn, env);
</script>

<template>
    <div class="thread-turn thought" :data-ref="turn.ref">
        <TextDisplay class="thought-text" :text="turn.title" />
        <div class="thread-tools">
            <ReplyTool title="Reply to this thought, quoting it" @reply="emit('reply', {text: words.text, ref: turn.ref})" />
        </div>
    </div>
</template>

<style scoped>
.thread-turn.thought {
    max-width: 88%;
}

.thought-text {
    padding: 7px 11px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: color-mix(in srgb, var(--raised) 50%, transparent);
    color: var(--text-4);
    font-size: 11.5px;
    font-style: italic;
    line-height: 1.5;
}

.thought-text :deep(> :first-child) {
    margin-top: 0;
}

.thought-text :deep(> :last-child) {
    margin-bottom: 0;
}

.thread-tools {
    position: absolute;
    top: -11px;
    right: -6px;
    display: flex;
    gap: 1px;
    padding: 1px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: var(--raised);
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition:
        opacity 0.16s ease-out,
        transform 0.16s ease-out;
}

.thread-turn:hover .thread-tools {
    opacity: 1;
    transform: none;
    pointer-events: auto;
}

.thread-tool {
    padding: 1px 7px;
    border: 0;
    border-radius: 99px;
    background: none;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1.5;
    cursor: pointer;
    white-space: nowrap;
}

.thread-tool:hover {
    background: var(--hover);
    color: var(--text);
}
</style>
