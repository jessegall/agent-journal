<script setup>
import Btn from "../kit/Btn.vue";

defineProps({id: {type: String, required: true}, plugin: Boolean, escNote: Boolean, busy: Boolean, phone: Boolean});
const words = defineModel({type: String, required: true});
const emit = defineEmits(["add", "cancel"]);
</script>

<template>
    <div :class="['sg-adjust', {phone}]">
        <label class="sg-label" :for="id">Your change</label>
        <p class="sg-note">
            {{
                plugin
                    ? "The plugin is not installed. Your change becomes a to-do."
                    : "Your change becomes a to-do in place of the suggestion."
            }}
        </p>
        <textarea :id="id" v-model="words" class="sg-words" placeholder="Write how you want it done" />
        <template v-if="escNote">
            <p class="sg-esc">Escape keeps your change. Press Cancel to drop it.</p>
        </template>
        <div class="sg-row">
            <Btn kind="primary" :large="phone" :busy="busy" :disabled="!words.trim()" @click="emit('add')">Add the to-do</Btn>
            <Btn :large="phone" @click="emit('cancel')">Cancel</Btn>
            <template v-if="!words.trim()">
                <span class="sg-hint">Write your change first</span>
            </template>
        </div>
    </div>
</template>

<style scoped>
.sg-adjust {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 12px;
}

.sg-label {
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
}

.sg-note {
    margin: 0;
    color: var(--text-3);
    font-size: 11.5px;
}

.sg-words {
    box-sizing: border-box;
    width: 100%;
    min-height: 64px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
}

.sg-words:focus {
    border-color: var(--accent);
}

.sg-words::placeholder {
    color: var(--text-4);
}

.sg-esc {
    margin: 0;
    color: var(--blocking);
    font-size: 11.5px;
}

.sg-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
}

.sg-hint {
    align-self: center;
    color: var(--text-3);
    font-size: 11.5px;
}

.phone .sg-label,
.phone .sg-note,
.phone .sg-hint,
.phone .sg-esc {
    font-size: 0.765em;
}

.phone .sg-words {
    min-height: 88px;
    border-radius: 12px;
    font-size: 16px;
}

.phone .sg-row :deep(.btn) {
    min-height: 44px;
}
</style>
