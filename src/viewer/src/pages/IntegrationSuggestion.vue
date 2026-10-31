<script setup>
import Btn from "../kit/Btn.vue";

const props = defineProps({suggestion: {type: Object, required: true}, busy: Boolean});
defineEmits(["install"]);

// how a suggested server is let in, in words
const letIn = () =>
    ({key: `Needs a key (${props.suggestion.key_var}).`, oauth: "Signs in on its own."})[props.suggestion.auth] || "Needs no key.";
</script>

<template>
    <li class="suggestion">
        <strong>{{ suggestion.title }}</strong>
        <p>{{ suggestion.about }}</p>
        <span class="integration-note">
            {{ letIn() }}
        </span>
        <Btn kind="primary" small :busy="busy" @click="$emit('install')">Install</Btn>
    </li>
</template>

<style scoped>
.suggestion {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border: 1px solid var(--line, #2a2d33);
    border-radius: 10px;
    background: var(--panel, #16181c);
}

.integration-note {
    font-size: 12px;
    color: var(--text-dim, #9aa0a6);
}

.suggestion p {
    margin: 0;
    color: var(--text-dim, #9aa0a6);
    font-size: 13px;
    flex: 1;
}
</style>
