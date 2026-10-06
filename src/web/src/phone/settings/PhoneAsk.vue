<script setup>
import {ref} from "vue";
import PhoneSheet from "../PhoneSheet.vue";

const props = defineProps({
    title: {type: String, required: true},
    sub: {type: String, default: ""},
    label: {type: String, default: ""},
    placeholder: {type: String, default: ""},
    button: {type: String, required: true},
    keep: {type: String, default: "Cancel"},
    danger: {type: Boolean, default: false},
    value: {type: String, default: ""},
});
const emit = defineEmits(["close", "done"]);
const sheet = ref(null);
const text = ref(props.value);
let sent = false;

function submit() {
    if (props.label && !text.value.trim()) return;
    sent = true;
    sheet.value.close();
}

function closed() {
    emit("close");
    if (sent) emit("done", text.value.trim());
}
</script>

<template>
    <PhoneSheet ref="sheet" :label="title" @close="closed">
        <template #head>
            <h2 class="ask-title">{{ title }}</h2>
            <template v-if="sub">
                <p class="ask-sub">{{ sub }}</p>
            </template>
        </template>
        <template v-if="label">
            <label class="ask-field">
                <span>{{ label }}</span>
                <input v-model="text" type="text" :placeholder="placeholder" autocapitalize="off" autocorrect="off" spellcheck="false" @keydown.enter="submit" />
            </label>
        </template>
        <slot />
        <div class="ask-buttons">
            <button type="button" class="ask-button" @click="sheet.close()">{{ keep }}</button>
            <button type="button" :class="['ask-button', 'ask-go', {danger}]" @click="submit">{{ button }}</button>
        </div>
    </PhoneSheet>
</template>

<style scoped>
.ask-title {
    margin: 0;
    font-size: 1.0625rem;
}

.ask-sub {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 0.875rem;
}

.ask-field {
    display: block;
    margin: 4px 0 12px;
}

.ask-field span {
    display: block;
    margin-bottom: 6px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.ask-field input {
    width: 100%;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.ask-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 8px 0;
}

.ask-button {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--sel);
    color: var(--text);
    font: inherit;
}

.ask-go {
    background: var(--accent);
    color: #fff;
}

.ask-go.danger {
    background: var(--danger);
}
</style>
