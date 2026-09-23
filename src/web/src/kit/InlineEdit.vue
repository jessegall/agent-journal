<script setup>
const props = defineProps({text: {type: String, default: ""}, editing: Boolean, caret: Boolean});
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
        {{ text }}
    </span>
</template>

<style scoped>
.editing {
    outline: 1px solid var(--accent);
    outline-offset: 2px;
    border-radius: 3px;
    cursor: text;
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
