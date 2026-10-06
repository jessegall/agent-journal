<script setup>
import {computed, defineAsyncComponent, ref} from "vue";
import {api} from "../api/client.js";
import {open} from "../domain/records.js";
import {meta} from "../domain/spec.js";
import {startWords, startedBy} from "../domain/triggerWords.js";
import {peek} from "../route.js";
import Btn from "../kit/Btn.vue";
import Caution from "../kit/Caution.vue";
import EmptyState from "../kit/EmptyState.vue";
import FormField from "../kit/FormField.vue";
import Icon from "../kit/Icon.vue";
import Toast from "../kit/Toast.vue";

const NewResource = defineAsyncComponent(() => import("./NewResource.vue"));
const props = defineProps({n: {type: Number, default: 0}, readonly: Boolean});
const chosen = defineModel("chosen", {type: Array, default: () => []});
const picking = ref(false);
const making = ref(false);
const replacing = ref(null);
const toast = ref(null);
const error = ref("");

const linked = computed(() => (props.n ? startedBy(props.n) : open("sequence").filter((s) => chosen.value.includes(s.n))));
const others = computed(() => open("sequence").filter((s) => !linked.value.some((l) => l.n === s.n)));
const groups = computed(() => [
    {key: "own", title: "", sequences: others.value.filter((s) => !s.data.system)},
    {key: "shipped", title: "Ships with the journal", sequences: others.value.filter((s) => s.data.system)},
]);
const startsHere = () => `trigger:${props.n}`;

async function start(sequence, on) {
    error.value = "";
    if (!props.n) return (chosen.value = on ? [...chosen.value, sequence.n] : chosen.value.filter((n) => n !== sequence.n));
    try {
        await api.setStartsOn(sequence.n, on ? startsHere() : "");
    } catch (e) {
        error.value = e.message;
    }
}

async function use(sequence) {
    replacing.value = null;
    picking.value = false;
    await start(sequence, true);
}

function pick(sequence) {
    if (sequence.data.system) return;
    if (props.n && sequence.data.starts_on) replacing.value = sequence;
    else use(sequence);
}

async function stop(sequence) {
    await start(sequence, false);
    toast.value = {text: `${sequence.title} no longer starts on this trigger.`, label: "Undo", action: () => start(sequence, true)};
}

const made = (n) => (api.setStartsOn(n, startsHere()), (making.value = false));
const reason = (sequence) =>
    sequence.data.system
        ? "Ships with the journal; its start can't change"
        : `Starts ${startWords(sequence).replace(/^Only/, "only").replace(/^When/, "when")}`;
</script>

<template>
    <FormField label="Sequence it starts">
        <template v-if="linked.length">
            <div class="list">
                <template v-for="sequence in linked" :key="sequence.n">
                    <div class="card">
                        <Icon :name="meta('sequence').icon" :size="14" />
                        <span class="card-text">
                            <span class="card-title">{{ sequence.title }}</span>
                            <span class="card-note">
                                Sequence {{ sequence.n }} · {{ sequence.sections.length }} steps{{
                                    sequence.data.system ? " · Ships with the journal" : ""
                                }}
                            </span>
                        </span>
                        <Btn small @click="peek('sequence', sequence.n)">Open</Btn>
                        <template v-if="!readonly && !sequence.data.system">
                            <Btn
                                small
                                title="This trigger no longer starts it. It then starts only when you or the agent start it."
                                @click="stop(sequence)"
                            >
                                Stop starting it
                            </Btn>
                        </template>
                    </div>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="empty">
                <EmptyState title="No sequence yet">This trigger does nothing until it starts one. Pick a sequence below.</EmptyState>
            </div>
        </template>
        <template v-if="!readonly">
            <div class="row">
                <template v-if="!picking">
                    <Btn small :kind="linked.length ? 'ghost' : 'primary'" @click="picking = true">
                        {{ linked.length ? "Start another sequence too" : "Pick a sequence" }}
                    </Btn>
                </template>
                <template v-if="n">
                    <Btn small kind="text" @click="making = true">Make a new sequence for it</Btn>
                </template>
            </div>
            <template v-if="picking">
                <div class="picker">
                    <div class="row between">
                        <b>Pick a sequence</b>
                        <Btn small @click="picking = false">Cancel</Btn>
                    </div>
                    <template v-if="replacing">
                        <Caution>
                            <b>{{ replacing.title }}</b>
                            now starts {{ startWords(replacing).replace(/^When/, "when") }}. Choosing it here replaces that: it will start
                            when this trigger matches instead.
                            <template #actions>
                                <Btn small @click="replacing = null">Keep it as it is</Btn>
                                <Btn small kind="primary" @click="use(replacing)">Use it here</Btn>
                            </template>
                        </Caution>
                    </template>
                    <div class="pick-list">
                        <template v-for="group in groups" :key="group.key">
                            <template v-if="group.sequences.length">
                                <template v-if="group.title">
                                    <span class="pick-heading">{{ group.title }}</span>
                                </template>
                                <template v-for="sequence in group.sequences" :key="sequence.n">
                                    <button type="button" class="pick" :disabled="Boolean(sequence.data.system)" @click="pick(sequence)">
                                        <span class="card-title">{{ sequence.title }}</span>
                                        <span class="card-note">{{ reason(sequence) }}</span>
                                    </button>
                                </template>
                            </template>
                        </template>
                    </div>
                </div>
            </template>
        </template>
        <template v-if="error">
            <p class="error">{{ error }}</p>
        </template>
        <template v-if="making">
            <NewResource type="sequence" @made="made" @close="making = false" />
        </template>
        <Toast :toast="toast" @done="toast = null" />
    </FormField>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 232px;
    overflow: auto;
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
    display: -webkit-box;
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.card-note {
    color: var(--text-3);
    font-size: 12px;
}

.empty {
    position: relative;
    min-height: 90px;
    border: 1px dashed var(--border-2);
    border-radius: 9px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.row.between {
    justify-content: space-between;
}

.picker {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 300px;
    padding: 10px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg-2);
}

.pick-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
}

.pick-heading {
    padding: 8px 10px 4px;
    border-top: 1px solid var(--line);
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.pick {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 8px 10px;
    border: 0;
    border-top: 1px solid var(--line);
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.pick:first-child {
    border-top: 0;
}

.pick:hover:not(:disabled) {
    background: var(--hover);
}

.pick:disabled {
    opacity: 0.5;
    cursor: default;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
