<script setup>
import {computed, ref} from "vue";
import {Btn, Dialog, Icon, TextInput} from "@journal/window-kit";

// making a secret: its kind, what it is for, a note, and for a custom one the name of its first field
const KINDS = [
    {key: "api key", icon: "key", title: "API key", line: "One hidden value, such as a token."},
    {key: "login", icon: "lock", title: "Login", line: "A username and a password."},
    {key: "custom", icon: "rows", title: "Custom", line: "Fields you name yourself."},
];
const props = defineProps({run: {type: Function, required: true}});
const emit = defineEmits(["close"]);
const kind = ref(KINDS[0].key);
const title = ref("");
const note = ref("");
const firstField = ref("");
const refusal = ref("");
const isCustom = computed(() => kind.value === "custom");
const isReady = computed(() => title.value.trim() && (!isCustom.value || firstField.value.trim()));

async function make() {
    const field = isCustom.value ? ["--field", firstField.value.trim()] : [];
    const brief = note.value.trim() ? ["--brief", note.value.trim()] : [];
    const answer = await props.run(["secret", "make", title.value.trim(), "--kind", kind.value, ...field, ...brief]);
    if (answer.ok) return emit("close");
    refusal.value = answer.error;
    return undefined;
}
</script>

<template>
    <Dialog title="New secret" @close="emit('close')">
        <div class="sections">
            <div class="choice">
                <span class="question">What kind of secret is it?</span>
                <div class="kinds" role="radiogroup" aria-label="Kind of secret">
                    <template v-for="choice in KINDS" :key="choice.key">
                        <button type="button" :class="['kind', {picked: kind === choice.key}]" role="radio" :aria-checked="kind === choice.key" :data-secret-kind="choice.key" @click="kind = choice.key">
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
                <TextInput v-model="firstField" label="Name of its first field" data-secret-first-field />
            </template>
            <p class="line">It shows on the page as a button until you give it a value.</p>
            <template v-if="refusal">
                <p class="refusal" role="alert">{{ refusal }}</p>
            </template>
        </div>
        <template #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="!isReady" data-secret-create @click="make">Make the secret</Btn>
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

.kinds {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
}

.kind {
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

.kind b {
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.kind span {
    font-size: 11.5px;
    line-height: 1.4;
}

.kind.picked {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}

.kind.picked b {
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
