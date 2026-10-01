<script setup>
import PhonePermit from "./PhonePermit.vue";
import {computed, inject, onMounted, ref, watch} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import AlertDialog from "../kit/AlertDialog.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {HELPER_WORDS, helperLine} from "../domain/helpers.js";
import {age, span} from "../format/time.js";
import {announce, tell} from "./announce.js";
import {ended} from "./outbox.js";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["back", "changed", "read"]);
const detail = ref(props.row);
const confirming = ref(false);
const stopping = ref(false);
const failed = inject("phoneFailed");
const error = ref("");
const current = computed(() => ({...props.row, ...detail.value}));
const runningFor = computed(() => span(Math.max(0, (current.value.completed_at || Date.now() / 1000) - current.value.started)));
const lastStep = computed(() => {
    const value = age(current.value.at);
    return value === "now" ? "just now" : value && `${value} ago`;
});
const stateAge = computed(() => {
    const value = age(current.value.completed_at || current.value.at);
    return value === "now" ? "just now" : value && `${value} ago`;
});

async function load() {
    try {
        detail.value = await phone.helper(props.row.n);
    } catch (caught) {
        if (ended(caught)) failed(caught);
    }
}

async function stop() {
    stopping.value = true;
    error.value = "";
    try {
        await phone.helperStop(props.row.n);
        confirming.value = false;
        announce(`Stopping ${current.value.name}`);
        emit("changed");
    } catch (caught) {
        if (ended(caught)) return failed(caught);
        tell(error, caught instanceof PhoneError ? caught.message : `Couldn't stop ${current.value.name}. Try again.`);
    } finally {
        stopping.value = false;
    }
}

onMounted(load);
watch(() => [props.row.at, props.row.state, props.row.report], load);
</script>

<template>
    <section class="helper-detail">
        <header class="helper-detail-bar">
            <button type="button" class="helper-back" @click="emit('back')">‹ At work</button>
            <template v-if="current.running">
                <button type="button" class="helper-stop" :disabled="stopping" @click="confirming = true">
                    {{ stopping ? "Stopping…" : `Stop ${current.name}` }}
                </button>
            </template>
        </header>
        <div class="helper-head">
            <div>
                <h2>{{ current.name }}</h2>
                <p>{{ helperLine(current) }}</p>
            </div>
            <span :class="['helper-pill', current.state]"><i />{{ HELPER_WORDS[current.state] }}</span>
        </div>
        <dl class="helper-facts">
            <template v-if="current.state === 'reported'">
                <div><dt>Reported</dt><dd>{{ stateAge }}</dd></div>
                <div><dt>Worked for</dt><dd>{{ runningFor }}</dd></div>
            </template>
            <template v-else>
                <div><dt>{{ current.state === "needs" ? "Waits for" : "Doing now" }}</dt><dd>{{ current.state === "needs" ? current.reason : current.now || "Working" }}</dd></div>
                <div><dt>Working for</dt><dd>{{ runningFor }}</dd></div>
                <div><dt>Last step</dt><dd>{{ lastStep }}</dd></div>
            </template>
        </dl>
        <template v-if="current.prompt">
            <PhonePermit :prompt="current.prompt" :helper="props.row.n" @answered="emit('changed')" />
        </template>
        <template v-if="current.todo?.n">
            <section class="helper-section">
                <h3>Its job</h3>
                <button type="button" class="helper-job" @click="emit('read', `todo:${current.todo.n}`)">
                    <i :class="{done: current.todo.completed}" />
                    <span><strong>#{{ current.todo.n }} {{ current.todo.title }}</strong><small>{{ current.todo.completed ? "Closed with its report" : "Taken, being worked on" }}</small></span>
                </button>
            </section>
        </template>
        <template v-if="current.report">
            <section class="helper-section">
                <h3>Its report</h3>
                <TextDisplay class="helper-report" :text="current.report" />
            </section>
        </template>
        <template v-if="current.activity?.length">
            <section class="helper-section">
                <h3>Recent activity</h3>
                <ul class="helper-activity">
                    <template v-for="step in current.activity" :key="step.ref">
                        <li><span>{{ age(step.created) }}</span><strong>{{ [step.label, step.name].filter(Boolean).join(" ") }}</strong></li>
                    </template>
                </ul>
            </section>
        </template>
        <template v-if="current.state === 'reported'">
            <p class="helper-finished">{{ current.name }} has finished its job. The agent in main reads this report next.</p>
        </template>
        <template v-if="error">
            <p class="helper-error" role="status">{{ error }}</p>
        </template>
    </section>
    <template v-if="confirming">
        <AlertDialog :title="`Stop ${current.name}?`">
            <p>{{ current.name }} stops now. What it has changed so far stays as it is, and its to-do #{{ current.todo?.n }} stays open.</p>
            <template #actions>
                <button type="button" class="confirm-stop" :disabled="stopping" @click="stop">Stop</button>
                <button type="button" class="confirm-keep" autofocus @click="confirming = false">Keep working</button>
            </template>
        </AlertDialog>
    </template>
</template>

<style scoped>
.helper-detail {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 18px;
}

.helper-detail-bar,
.helper-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.helper-back,
.helper-stop {
    min-height: 44px;
    padding: 0 8px;
    border: 0;
    background: transparent;
    color: var(--accent-text);
    font: inherit;
}

.helper-back {
    margin-left: -8px;
}

.helper-stop {
    margin-right: -8px;
    color: var(--danger);
}

.helper-stop:disabled {
    color: var(--text-3);
}

.helper-head h2,
.helper-head p {
    margin: 0;
}

.helper-head h2 {
    font-size: 1.294rem;
}

.helper-head p {
    color: var(--text-3);
}

.helper-pill {
    display: flex;
    flex: none;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 17px;
    color: var(--text-2);
    font-size: 0.824rem;
}

.helper-pill i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
}

.helper-pill.needs i {
    background: var(--tone-warn);
}

.helper-pill.reported i {
    background: var(--tone-good);
}

.helper-facts {
    margin: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.helper-facts div {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    min-height: 44px;
    padding: 11px 16px;
}

.helper-facts div + div {
    border-top: 1px solid var(--line);
}

.helper-facts dt {
    color: var(--text-2);
}

.helper-facts dd {
    margin: 0;
    text-align: right;
}

.helper-section h3 {
    margin: 0 0 7px;
    padding: 0 4px;
    color: var(--text-2);
    font-size: 0.824rem;
}

.helper-job {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 54px;
    padding: 9px 16px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    text-align: left;
}

.helper-job i {
    width: 14px;
    height: 14px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    box-shadow: inset 0 0 0 3px var(--hover), inset 0 0 0 8px var(--accent);
}

.helper-job i.done {
    border-color: var(--tone-good);
    box-shadow: inset 0 0 0 3px var(--hover), inset 0 0 0 8px var(--tone-good);
}

.helper-job span {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.helper-job strong,
.helper-job small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.helper-job small {
    color: var(--text-3);
}

.helper-report {
    padding: 14px 16px;
    border-radius: 12px;
    background: var(--hover);
}

.helper-activity {
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.helper-activity li {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 8px;
    padding: 10px 16px;
    color: var(--text-3);
    font-size: 0.824rem;
}

.helper-activity li + li {
    border-top: 1px solid var(--line);
}

.helper-activity strong {
    color: var(--text-2);
    font-weight: 400;
}

.helper-finished,
.helper-error {
    margin: 0 4px;
    color: var(--text-3);
    font-size: 0.824rem;
}

.helper-error {
    color: var(--danger);
}

.confirm-stop {
    color: var(--danger) !important;
}

.confirm-keep {
    font-weight: 700 !important;
}
</style>
