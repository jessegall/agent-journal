<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {open} from "../domain/records.js";
import {tables} from "../domain/tables.js";
import {startWords, wordsText} from "../domain/triggerWords.js";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import Segmented from "../kit/Segmented.vue";

const props = defineProps({resource: Object, bare: Boolean});
const MODES = [
    {key: "hand", label: "Only when you or the agent start it"},
    {key: "event", label: "When a row is created"},
    {key: "trigger", label: "When a trigger matches"},
];
const error = ref("");
const chosen = ref("");
const stored = computed(() => ((props.resource.trigger_ids || []).length ? "trigger" : props.resource.trigger_event ? "event" : "hand"));
const mode = computed(() => chosen.value || stored.value);
const created = computed(() => props.resource.trigger_event.split(".")[0]);
const kinds = computed(() => tables.value.filter((t) => t.in_sidebar && !["sequences", "triggers"].includes(t.name)));

async function save(value) {
    error.value = "";
    try {
        await api.setStartsOn(props.resource.id, value);
    } catch (e) {
        error.value = e.message;
    }
}

function pickMode(key) {
    chosen.value = key === stored.value ? "" : key;
    if (key === "hand") save("");
    if (key === "event" && stored.value !== "event") save(`${kinds.value[0].name}.created`);
}

const kindChoices = computed(() => kinds.value.map((t) => ({value: t.name, label: t.title, current: created.value === t.name})));
const triggerChoices = computed(() =>
    open("triggers").map((t) => ({value: `trigger:${t.id}`, label: wordsText(t.phrases) || `Trigger ${t.id}`, current: (props.resource.trigger_ids || []).includes(t.id)}))
);
</script>

<template>
    <section :class="['starts', {bare}]">
        <template v-if="!bare">
            <h3>When it starts</h3>
        </template>
        <p class="sentence">{{ startWords(resource) }}.</p>
        <FormField label="How this sequence starts">
            <Segmented fill wrap :options="MODES" :value="mode" @pick="pickMode" />
        </FormField>
        <template v-if="mode === 'event'">
            <FormField label="Row that starts this sequence when it is created">
                <ChoiceList :choices="kindChoices" @pick="(table) => save(`${table}.created`)" />
            </FormField>
        </template>
        <template v-if="mode === 'trigger'">
            <FormField label="Trigger that starts this sequence">
                <ChoiceList stacked :choices="triggerChoices" @pick="save" />
            </FormField>
        </template>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
    </section>
</template>

<style scoped>
.starts {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

h3 {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.starts.bare {
    margin-top: 0;
}

.sentence {
    margin: 0;
    color: var(--text-2);
}

.card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
}

.card-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.card-title {
    color: var(--text);
    font-weight: 500;
}

.card-note {
    color: var(--text-3);
    font-size: 12px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
