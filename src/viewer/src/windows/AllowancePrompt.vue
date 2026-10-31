<script setup>
import Btn from "../kit/Btn.vue";
import {promptText} from "./allowancePrompts.js";

defineProps({request: {type: Object, required: true}});
const emit = defineEmits(["answer"]);
</script>

<template>
    <div class="allowance-prompt" role="dialog">
        <p class="allowance-prompt-text">{{ promptText(request) }}</p>
        <div class="allowance-prompt-buttons">
            <Btn kind="primary" @click="emit('answer', true)">Allow</Btn>
            <Btn @click="emit('answer', false)">Not now</Btn>
        </div>
    </div>
</template>

<style scoped>
.allowance-prompt {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--bg);
}

.allowance-prompt-text {
    margin: 0;
    color: var(--text);
}

.allowance-prompt-buttons {
    display: flex;
    gap: 8px;
}
</style>
