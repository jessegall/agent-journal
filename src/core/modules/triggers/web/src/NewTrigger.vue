<script setup>
import {computed, reactive, ref} from "vue";
import {Btn, Dialog, Segmented, useWindow} from "@journal/window-kit";
import {EXAMPLES, doesOf} from "./triggerWords.js";
import TriggerEditor from "./TriggerEditor.vue";

const KINDS = [
    {key: "words", label: "When words appear"},
    {key: "time", label: "On a schedule"},
];
const emit = defineEmits(["close"]);
const context = useWindow();
const kind = ref("words");
const draft = reactive({phrases: [], action: "nudge", text: ""});
const schedule = reactive({every: "", at: ""});
const failure = ref("");

const missing = computed(() => {
    if (kind.value === "time") return !draft.text.trim() ? "Write what to tell the agent." : schedule.every || schedule.at ? "" : "Choose a time or how often.";
    if (!draft.phrases.length) return "Add at least one word.";
    return draft.text.trim() ? "" : `Write ${doesOf(draft.action).ask.toLowerCase()}.`;
});

const startFrom = ({phrases, action, text}) => Object.assign(draft, {phrases, action, text});

function line() {
    if (kind.value === "words") return ["trigger", "make", draft.phrases.join(", "), draft.text.trim(), "--do", draft.action];
    const time = schedule.every ? ["--every", String(schedule.every)] : ["--at", new Date(schedule.at).toISOString()];
    return ["trigger", "schedule", draft.text.trim(), ...time];
}

async function create() {
    const answer = await context.run(line());
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("close");
}
</script>

<template>
    <Dialog title="New trigger" @close="emit('close')">
        <div class="new-trigger">
            <Segmented :options="KINDS" :value="kind" @pick="kind = $event" />
            <template v-if="kind === 'words'">
                <div class="examples">
                    <span class="label">Start with an example</span>
                    <div class="example-list">
                        <template v-for="example in EXAMPLES" :key="example.name">
                            <Btn small @click="startFrom(example)">{{ example.name }}</Btn>
                        </template>
                    </div>
                </div>
                <TriggerEditor :trigger="draft" @change="Object.assign(draft, $event)" />
            </template>
            <template v-else>
                <TriggerEditor :trigger="{...draft, next_at: 'scheduled'}" @change="Object.assign(draft, $event)" />
                <div class="times">
                    <label class="time">
                        <span class="label">Every so many minutes</span>
                        <input v-model="schedule.every" type="number" min="1" data-trigger-every>
                    </label>
                    <label class="time">
                        <span class="label">Or once, at</span>
                        <input v-model="schedule.at" type="datetime-local" :disabled="Boolean(schedule.every)" data-trigger-at>
                    </label>
                </div>
            </template>
        </div>
        <template #foot>
            <span class="note" role="status">{{ failure || missing }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="Boolean(missing)" data-trigger-create @click="create">Create trigger</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.new-trigger {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.examples,
.time {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.example-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.label {
    color: var(--text-3);
    font-size: 12px;
}

.times {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.time input {
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
