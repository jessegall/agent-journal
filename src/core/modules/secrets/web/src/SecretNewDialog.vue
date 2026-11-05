<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Icon, TextInput} from "@journal/window-kit";

// making a secret: its type, what it is for, a note, and for a custom one the name of its first field
const TYPES = [
    {key: "api key", icon: "key", title: "API key", line: "One hidden value, such as a token."},
    {key: "login", icon: "lock", title: "Login", line: "A username and a password."},
    {key: "custom", icon: "rows", title: "Custom", line: "Fields you name yourself."},
];
const props = defineProps({run: {type: Function, required: true}});
const emit = defineEmits(["close"]);
const type = ref(TYPES[0].key);
const title = ref("");
const note = ref("");
const firstField = ref("");
const refusal = ref("");
const isCustom = computed(() => type.value === "custom");
const isReady = computed(() => title.value.trim() && (!isCustom.value || firstField.value.trim()));

async function make() {
    const field = isCustom.value ? ["--field", firstField.value.trim()] : [];
    const brief = note.value.trim() ? ["--brief", note.value.trim()] : [];
    const answer = await props.run(["secret", "make", title.value.trim(), "--type", type.value, ...field, ...brief]);
    if (answer.ok) return emit("close");
    refusal.value = answer.error;
    return undefined;
}
</script>

<template>
    <Dialog title="New secret" @close="emit('close')">
        <div class="sections">
            <div class="choice">
                <span class="question">What type of secret is it?</span>
                <div class="types" role="radiogroup" aria-label="Type of secret">
                    <template v-for="choice in TYPES" :key="choice.key">
                        <button type="button" :class="['type', {picked: type === choice.key}]" role="radio" :aria-checked="type === choice.key" :data-secret-type="choice.key" @click="type = choice.key">
                            <Icon :name="choice.icon" :size="16" />
                            <b>{{ choice.title }}</b>
                            <span>{{ choice.line }}</span>
                        </button>
                    </template>
                </div>
            </div>
            <TextInput v-model="title" label="What is it for?" data-secret-new-title />
            <TextInput v-model="note" label="Note for the agent" data-secret-new-note />
            <template v-if="isCustom">
                <TextInput v-model="firstField" label="First field name" data-secret-first-field />
            </template>
            <p class="line">After creating the secret, select Add credentials to save your key or login.</p>
            <template v-if="refusal">
                <p class="refusal" role="alert">{{ refusal }}</p>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="!isReady" data-secret-create @click="make">Create secret</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.sections {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.choice {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.question {
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
}

.type {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text-3);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.type b {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.type span {
    font-size: 11.5px;
    line-height: 1.4;
}

.type.picked {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}

.type.picked b {
    color: var(--accent-text);
}

.line {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
}

.refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
