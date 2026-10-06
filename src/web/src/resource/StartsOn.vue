<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {momentsOf} from "../domain/moments.js";
import {open} from "../domain/records.js";
import {types} from "../domain/spec.js";
import {doesOf, startWords, startsOnTrigger, wordsText} from "../domain/triggerWords.js";
import {peek} from "../route.js";
import Btn from "../kit/Btn.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import FormField from "../kit/FormField.vue";
import NewResource from "./NewResource.vue";
import Segmented from "../kit/Segmented.vue";

const props = defineProps({resource: Object, bare: Boolean});
const BY_HAND = "";
const MODES = [
    {key: "hand", label: "Only when you or the agent start it"},
    {key: "event", label: "When something happens"},
    {key: "trigger", label: "When a trigger matches"},
];
const making = ref(false);
const error = ref("");

const start = computed(() => props.resource.data.starts_on || BY_HAND);
const editable = computed(() => !props.resource.data.system && !props.resource.completed);
const stored = computed(() => (!start.value ? "hand" : startsOnTrigger(props.resource) ? "trigger" : "event"));
const chosen = ref("");
const mode = computed(() => chosen.value || stored.value);
const kind = computed(() => start.value.split(".")[0]);
const moment = computed(() => start.value.split(".")[1] || "");
const kinds = computed(() =>
    types.value.filter(
        (t) => (t.in_sidebar || t.needs_attention || t.name === "board") && t.moments?.length && !["sequence", "trigger"].includes(t.name)
    )
);
const triggers = computed(() => open("trigger"));
const current = computed(() => triggers.value.find((t) => start.value === `trigger:${t.n}`));
const sentence = computed(() =>
    start.value
        ? `Starts by itself ${startWords(props.resource).replace(/^When/, "when")}.`
        : "It starts only when you or the agent start it."
);

async function save(value) {
    error.value = "";
    try {
        await api.setStartsOn(props.resource.n, value);
    } catch (e) {
        error.value = e.message;
    }
}

function pickMode(key) {
    chosen.value = key === stored.value ? "" : key;
    if (key === "hand") save(BY_HAND);
    if (key === "event" && stored.value !== "event") save(`${kinds.value[0].name}.created`);
}

const asTrigger = (t) => ({
    value: `trigger:${t.n}`,
    label: t.title,
    hint: wordsText(t.data.words),
    unavailable: t.data.does === "start" ? "" : `${doesOf(t.data.does).short} Set it to Start a sequence first.`,
    current: start.value === `trigger:${t.n}`,
});
const kindChoices = computed(() => kinds.value.map((t) => ({value: t.name, label: t.title, current: kind.value === t.name})));
const momentChoices = computed(() =>
    momentsOf(kind.value).map((m) => ({value: m.value, label: m.label, current: moment.value === m.value}))
);
const others = computed(() => triggers.value.filter((t) => t.n !== current.value?.n).map(asTrigger));
</script>

<template>
    <section :class="['starts', {bare}]">
        <template v-if="!bare">
            <h3>When it starts</h3>
        </template>
        <p class="sentence">{{ sentence }}</p>
        <template v-if="editable">
            <FormField label="Starts">
                <Segmented fill wrap :options="MODES" :value="mode" @pick="pickMode" />
            </FormField>
            <template v-if="mode === 'event'">
                <FormField label="Kind of item">
                    <ChoiceList :choices="kindChoices" @pick="(type) => save(`${type}.created`)" />
                </FormField>
                <FormField label="What happens to it">
                    <ChoiceList :choices="momentChoices" @pick="(value) => save(`${kind}.${value}`)" />
                </FormField>
            </template>
            <template v-if="mode === 'trigger'">
                <template v-if="current">
                    <FormField label="The trigger">
                        <div class="card">
                            <span class="card-text">
                                <span class="card-title">{{ current.title }}</span>
                                <span class="card-note">Trigger {{ current.n }} · {{ wordsText(current.data.words) }}</span>
                            </span>
                            <Btn small @click="peek('trigger', current.n)">Open trigger</Btn>
                        </div>
                    </FormField>
                </template>
                <FormField :label="current ? 'Or pick another trigger' : 'Pick a trigger'">
                    <ChoiceList stacked :choices="others" @pick="save" />
                </FormField>
                <Btn small @click="making = true">Make a new trigger for this sequence</Btn>
            </template>
        </template>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="making">
            <NewResource type="trigger" :sequence="resource.n" @made="making = false" @close="making = false" />
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
