<script setup>
import {computed} from "vue";

const props = defineProps({text: {type: String, default: ""}, editing: Boolean, caret: Boolean, typing: Boolean});
const words = computed(() => props.text.match(/\S+\s*/g) || []);
const emit = defineEmits(["start", "save"]);
const stopWhileEditing = (event) => props.editing && event.stopPropagation();
const save = (event) => props.editing && emit("save", event.target.innerText.trim());
</script>

<template>
    <span
        :class="['inline-edit', {caret, editing}]"
        :contenteditable="editing"
        @dblclick.stop="emit('start')"
        @click="stopWhileEditing"
        @blur="save"
    >
        <template v-if="typing && !editing">
            <template v-for="(word, at) in words" :key="at">
                <span class="word">{{ word }}</span>
            </template>
        </template>
        <template v-else>{{ text }}</template>
    </span>
</template>

<style scoped>
.editing {
    outline: 1px solid var(--accent);
    outline-offset: 2px;
    border-radius: 3px;
    cursor: text;
}

.word {
    animation: word-in 0.42s cubic-bezier(0.2, 0.7, 0.3, 1) both;
    white-space: pre-wrap;
}

@keyframes word-in {
    from {
        opacity: 0;
        filter: blur(2px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .word {
        animation: none;
    }
}

.caret::after {
    content: "";
    display: inline-block;
    width: 2px;
    height: 14px;
    margin-right: -4px;
    margin-left: 2px;
    vertical-align: -2px;
    background: var(--text-2);
    animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .caret::after {
        animation: none;
    }
}
</style>
