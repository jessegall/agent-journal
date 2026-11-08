<script setup>
import {computed, reactive, ref, watch} from "vue";
import {Btn, Dialog, useWindow} from "@journal/window-kit";
import {DOES, EXAMPLES, PLACES, TIME_DOES, WHEN_TYPES, doesOf, localTimeInput, sentence} from "./triggerWords.js";
import TriggerActionFields from "./TriggerActionFields.vue";
import TriggerConditionFields from "./TriggerConditionFields.vue";
import TriggerPart from "./TriggerPart.vue";
import TriggerTiles from "./TriggerTiles.vue";
import TriggerTimeFields from "./TriggerTimeFields.vue";
import TriggerWordFields from "./TriggerWordFields.vue";

// one dialog for a new trigger and for an open one, in the order a trigger reads: its name, When, Condition, Action; Save applies everything, Cancel drops it
const props = defineProps({trigger: {type: Object, default: null}});
const emit = defineEmits(["close"]);
const context = useWindow();
const held = props.trigger;
const heldTime = () => (held?.cron_line ? "cron" : held?.next_at && !held?.interval_minutes ? "once" : "every");
const draft = reactive({
    name: held?.name ?? "",
    description: held?.description ?? "",
    type: held?.next_at ? "time" : "words",
    time: heldTime(),
    phrases: [...(held?.phrases ?? [])],
    places: [...(held?.watch_places ?? PLACES.map((place) => place.key))],
    match: held?.match_mode ?? "part",
    every: held?.interval_minutes ? String(held.interval_minutes) : "",
    at: held?.next_at ? localTimeInput(held.next_at) : "",
    cron: held?.cron_line ?? "",
    limit: held?.fire_limit ? String(held.fire_limit) : "",
    conditions: JSON.parse(held?.conditions ?? "[]"),
    action: held?.action ?? "nudge",
    skill: held?.skill ?? "",
    text: held?.text ?? "",
    extra: JSON.parse(held?.extra_actions ?? "[]"),
});
const failure = ref("");
const confirming = ref(false);
const isNew = computed(() => !held);
const missing = computed(() => {
    if (!draft.name.trim()) return "Give it a name.";
    if (draft.type === "words" && !draft.phrases.length) return "Add at least one word.";
    if (draft.type === "words" && !draft.places.length) return "Choose where to look.";
    if (draft.type === "time" && !{every: draft.every, once: draft.at, cron: draft.cron}[draft.time]) return "Choose when.";
    if (draft.action === "skill") return draft.skill.trim() ? "" : "Choose a skill.";
    return draft.text.trim() ? "" : `Write ${doesOf(draft.action).ask.toLowerCase()}.`;
});
const startFrom = ({name, phrases, action, text}) => Object.assign(draft, {name, phrases, action, text, type: "words"});
const changeExtra = (position, values) => (draft.extra = draft.extra.map((entry, place) => place === position ? {...entry, ...values} : entry));
watch(() => draft.type, (type) => {
    if (type === "time" && ["deny", "skill"].includes(draft.action)) draft.action = "nudge";
});

const timeValue = () => (draft.time === "once" ? new Date(draft.at).toISOString() : draft[draft.time]);
const startFlags = () => [{every: "--every", once: "--at", cron: "--cron"}[draft.time], timeValue()];
const editFlags = () => [{every: "--interval-minutes", once: "--next-at", cron: "--cron-line"}[draft.time], timeValue()];
const detailFlags = () => [...(draft.action === "skill" ? ["--skill", draft.skill] : []),"--name", draft.name.trim(), "--description", draft.description.trim(), "--conditions", JSON.stringify(draft.conditions), "--extra-actions", JSON.stringify(draft.extra),
    ...(draft.type === "words" ? ["--watch-places", ...draft.places, "--match-mode", draft.match] : [])];
const limitFlags = (flag) => (draft.limit ? [flag, draft.limit] : []);

function newLine() {
    if (draft.type === "words") return ["trigger", "make", "--do", draft.action, ...detailFlags(), "--", draft.phrases.join(", "), draft.text.trim()];
    return ["trigger", "schedule", "--do", draft.action, ...detailFlags(), ...startFlags(), ...limitFlags("--times"), "--", draft.text.trim()];
}

function editLine() {
    const line = ["trigger", "edit", String(held.id), "--text", draft.action === "skill" ? `Read ${draft.skill}` : draft.text.trim(), "--action", draft.action, ...detailFlags()];
    return draft.type === "words" ? [...line, ...draft.phrases.map((phrase) => `--phrases=${phrase}`)] : [...line, ...editFlags(), ...limitFlags("--fire-limit")];
}

async function ran(line) {
    const answer = await context.run(line);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) emit("close");
}

const save = () => ran(isNew.value ? newLine() : editLine());
const pause = () => ran(["trigger", "pause", String(held.id), ...(held.paused_at ? ["--off"] : [])]);
const end = () => ran(["trigger", "strike", String(held.id)]);
</script>

<template>
    <Dialog padded :title="isNew ? 'New trigger' : 'Edit trigger'" @close="emit('close')">
        <div class="trigger-form">
            <template v-if="isNew">
                <div class="field">
                    <span class="label">Start with an example</span>
                    <div class="examples">
                        <template v-for="example in EXAMPLES" :key="example.name">
                            <Btn small bordered @click="startFrom(example)">{{ example.name }}</Btn>
                        </template>
                    </div>
                </div>
            </template>
            <TriggerPart title="Name" hint="How it shows on the page">
                <label class="field"><span class="label">Name</span><input v-model="draft.name" placeholder="For example, Never force push" data-trigger-name></label>
                <label class="field"><span class="label">Description</span><input v-model="draft.description" placeholder="A short description" data-trigger-description></label>
            </TriggerPart>
            <div class="summary"><small>What this trigger does</small>{{ sentence(draft) }}</div>
            <TriggerPart title="When" hint="What sets it off">
                <template v-if="isNew">
                    <TriggerTiles v-model="draft.type" :options="WHEN_TYPES" mark="trigger-type" />
                </template>
                <template v-if="draft.type === 'words'">
                    <TriggerWordFields v-model:phrases="draft.phrases" v-model:places="draft.places" v-model:match="draft.match" />
                </template>
                <template v-else>
                    <TriggerTimeFields v-model:time="draft.time" v-model:every="draft.every" v-model:at="draft.at" v-model:cron="draft.cron" v-model:limit="draft.limit" :is-new="isNew" />
                </template>
            </TriggerPart>
            <TriggerPart title="Condition" hint="Narrow it down. With none, it always applies.">
                <TriggerConditionFields v-model="draft.conditions" />
            </TriggerPart>
            <TriggerPart title="Action" hint="What it does, in order">
                <TriggerActionFields v-model:skill="draft.skill" v-model:action="draft.action" v-model:text="draft.text" v-model:extra="draft.extra" :choices="draft.type === 'time' ? TIME_DOES : DOES" @change-extra="changeExtra" />
            </TriggerPart>
        </div>
        <template #foot>
            <span class="note" role="status">{{ failure || missing || (isNew ? "" : "Changes apply the next time this trigger runs.") }}</span>
            <template v-if="!isNew">
                <template v-if="confirming">
                    <Btn variant="danger" data-trigger-strike-sure @click="end">Yes, end it</Btn>
                </template>
                <template v-else>
                    <Btn variant="danger" data-trigger-strike @click="confirming = true">End this trigger</Btn>
                </template>
                <Btn data-trigger-pause @click="pause">{{ held.paused_at ? "Resume" : "Pause" }}</Btn>
            </template>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn variant="primary" :disabled="Boolean(missing)" data-trigger-save @click="save">{{ isNew ? "Create trigger" : "Save" }}</Btn>
        </template>
    </Dialog>
</template>

<style scoped src="./triggerForm.css"></style>

<style scoped>
.trigger-form {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.summary {
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg-2);
    font-size: 13.5px;
    line-height: 1.55;
}

.summary small {
    display: block;
    margin-bottom: 4px;
    color: var(--text-3);
    font-size: 11.5px;
}

.examples {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.note {
    flex: 1;
    color: var(--text-3);
    font-size: 12px;
}
</style>
