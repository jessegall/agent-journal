<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Segmented from "../kit/Segmented.vue";
import Skeleton from "../kit/Skeleton.vue";
import RowMoves from "../resource/RowMoves.vue";
import {updatedAt} from "../domain/row.js";
import {ago} from "../format/time.js";
import TaskStatusIcon from "./TaskStatusIcon.vue";

// one task as version 4's inspector drew it: where it stands, why it stopped, what it waits on, its brief and log, and what can be done to it
const PRIORITIES = [
    {key: "low", label: "Low"},
    {key: "normal", label: "Normal"},
    {key: "high", label: "High"},
];
const FINISHED = new Set(["completed", "cancelled"]);
const LONG_BRIEF = 180;
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, lone: Boolean, stepped: Boolean, backed: Boolean, changes: {type: Number, default: 0}});
const emit = defineEmits(["close", "step", "select", "back"]);
const task = ref(null);
const place = ref(null);
const failure = ref("");
const refusal = ref("");
const briefWhole = ref(false);
const menu = ref(null);
const footer = ref(null);
let reading = 0;

const iconOf = (state) => (FINISHED.has(state) ? "done" : state);
const label = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
const crumb = computed(() => {
    if (!place.value?.plan_id) return "Not in a plan";
    return place.value.phase_total > 1 ? `Plan ${place.value.plan_id} › Phase ${place.value.phase_number}: ${place.value.phase_title}` : `Plan ${place.value.plan_id}: ${place.value.plan_title}`;
});

async function load() {
    const turn = ++reading;
    const [answer, where] = await Promise.all([props.read(["task", "inspect", String(props.id)]), props.read(["plan", "place", String(props.id)])]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    task.value = answer.ok ? answer.value : null;
    place.value = where.ok ? where.value : null;
}

watch(() => props.id, () => {
    task.value = null;
    place.value = null;
    briefWhole.value = false;
    menu.value = null;
    load();
}, {immediate: true});
watch(() => props.changes, load);

async function setPriority(priority) {
    const answer = await props.read(["task", "edit", String(props.id), "--priority", priority]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) return load();
}

function pick(move) {
    menu.value = null;
    footer.value.press(move);
}

const openStatus = (element) => footer.value?.moves.length && (menu.value = element);
defineExpose({openStatus});
</script>

<template>
    <aside :class="['task-inspector', {lone}]" data-task-inspector>
        <div class="top">
            <template v-if="backed">
                <Btn small aria-label="Back" data-resource-back @click="emit('back')"><Icon name="back" :size="12" /></Btn>
            </template>
            <span class="crumb" data-task-crumb>{{ crumb }}</span>
            <span class="grow" />
            <template v-if="stepped">
                <Btn small title="Previous task (K)" aria-label="Previous task" @click="emit('step', -1)"><Icon name="up" :size="13" /></Btn>
                <Btn small title="Next task (J)" aria-label="Next task" @click="emit('step', 1)"><Icon name="down" :size="13" /></Btn>
            </template>
            <Btn small aria-label="Close the task (Esc)" data-resource-close @click="emit('close')"><Icon name="close" :size="13" /></Btn>
        </div>
        <template v-if="failure">
            <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
        </template>
        <template v-else-if="!task">
            <div class="body"><Skeleton /></div>
        </template>
        <template v-else>
            <div :key="task.id" class="body">
                <div class="stamp">Task {{ task.id }} · updated {{ ago(updatedAt(task)) || "just now" }}</div>
                <h3 class="title" data-resource-title>{{ task.title }}</h3>
                <div :class="['state-line', iconOf(task.state)]">
                    <button type="button" class="state" data-task-state title="Change the status (S)" @click="openStatus($event.currentTarget)">
                        <TaskStatusIcon :status="iconOf(task.state)" />
                        {{ label(task.state) }}
                    </button>
                    <span class="since">since {{ ago(updatedAt(task)) || "just now" }}</span>
                </div>
                <template v-if="task.state === 'blocked'">
                    <section class="reason" data-task-reason>
                        <span class="label">Blocked, waiting on</span>
                        <p class="text">{{ task.reason || "Other tasks" }}</p>
                        <p class="note">Nothing opens it by itself. Unblock it when that is done.</p>
                    </section>
                </template>
                <template v-else-if="task.state === 'cancelled' && task.reason">
                    <section class="reason" data-task-reason>
                        <span class="label">Why it was cancelled</span>
                        <p class="text">{{ task.reason }}</p>
                    </section>
                </template>
                <div class="facts">
                    <div class="fact wide">
                        <span class="fact-label">Plan</span>
                        <span class="fact-value">{{ place?.plan_id ? `Plan ${place.plan_id}: ${place.plan_title}` : "Not in a plan" }}</span>
                    </div>
                    <template v-if="place?.phase_total > 1">
                        <div class="fact">
                            <span class="fact-label">Phase</span>
                            <span class="fact-value">{{ place.phase_number }} of {{ place.phase_total }}: {{ place.phase_title }}</span>
                        </div>
                    </template>
                    <template v-if="task.state === 'started' && task.holder_id">
                        <div class="fact">
                            <span class="fact-label">Holder</span>
                            <span class="fact-value">Agent {{ task.holder_id }}</span>
                        </div>
                    </template>
                    <template v-if="!FINISHED.has(task.state)">
                        <div class="fact wide">
                            <span class="fact-label">Priority</span>
                            <Segmented :options="PRIORITIES" :value="task.priority" data-task-priority @pick="setPriority" />
                            <template v-if="refusal">
                                <p class="refusal" role="alert" data-task-refusal>{{ refusal }}</p>
                            </template>
                        </div>
                    </template>
                </div>
                <template v-if="task.waits.length">
                    <section class="part" data-resource-waits>
                        <h4>Waits on</h4>
                        <template v-for="wait in task.waits" :key="wait.id">
                            <button type="button" class="wait" @click="emit('select', wait.id)">
                                <TaskStatusIcon :status="iconOf(wait.state)" :size="12" />
                                <span class="wait-id">{{ wait.id }}</span>
                                <span class="wait-title">{{ wait.title }}</span>
                            </button>
                        </template>
                    </section>
                </template>
                <template v-if="task.state === 'completed' && task.outcome">
                    <section class="part" data-task-outcome>
                        <h4>How it was done</h4>
                        <p class="text">{{ task.outcome }}</p>
                    </section>
                </template>
                <template v-if="task.brief">
                    <section class="part" data-task-brief>
                        <h4>The brief</h4>
                        <p :class="['text', {clamped: !briefWhole}]">{{ task.brief }}</p>
                        <template v-if="task.brief.length > LONG_BRIEF && !briefWhole">
                            <button type="button" class="more" @click="briefWhole = true">Show the whole brief</button>
                        </template>
                    </section>
                </template>
                <template v-if="task.logs.length">
                    <section class="part" data-resource-logs>
                        <h4>Log</h4>
                        <template v-for="log in task.logs" :key="log.id">
                            <p class="log">{{ log.line }}</p>
                        </template>
                    </section>
                </template>
            </div>
        </template>
        <RowMoves ref="footer" kind="task" :id="id" :row="task" :read="read" @done="load" />
        <template v-if="menu">
            <MenuPanel :anchor="menu" :min-width="220" :max-width="300" @close="menu = null">
                <MenuLabel>Change the status of task {{ id }}</MenuLabel>
                <template v-for="move in footer.moves" :key="move.word">
                    <MenuItem @click="pick(move)">{{ move.label }}</MenuItem>
                </template>
            </MenuPanel>
        </template>
    </aside>
</template>

<style scoped>
.task-inspector {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 440px;
    min-height: 0;
    border-left: 1px solid var(--border);
}

.task-inspector.lone {
    flex: 1;
    width: 100%;
    border-left: 0;
}

.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 44px;
    padding: 0 8px 0 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

.crumb {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.grow {
    flex: 1;
}

.body {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}

.failure {
    flex: 1;
    margin: 0;
    padding: 18px 20px;
    color: var(--danger);
    font-size: 12.5px;
}

.refusal {
    margin: 2px 0 0;
    color: var(--danger);
    font-size: 12.5px;
}

.stamp,
.since {
    color: var(--text-3);
    font-size: 12px;
}

.title {
    margin: 6px 0 14px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    text-wrap: pretty;
}

.state-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}

.state {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    margin: -1px 0 -1px -7px;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: 12.5px var(--font);
    cursor: pointer;
    transition: background-color 0.12s ease;
}

.state:hover {
    background: var(--hover);
}

.reason {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 18px;
    padding-left: 12px;
    border-left: 2px solid var(--tone-warn);
}

.reason .label {
    color: var(--text-4);
    font-size: 11.5px;
}

.facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px 20px;
    margin-bottom: 18px;
}

.fact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    min-width: 0;
}

.fact.wide {
    grid-column: 1 / -1;
}

.fact-label {
    color: var(--text-3);
    font-size: 12px;
}

.fact-value {
    font-size: 13px;
    overflow-wrap: anywhere;
}

.part {
    margin-bottom: 18px;
}

.part h4 {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}

.text.clamped {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

.more {
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    font: 12px var(--font);
    cursor: pointer;
}

.more:hover {
    color: var(--text);
}

.wait {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    padding: 5px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.wait:hover {
    background: var(--hover);
    color: var(--text);
}

.wait-id {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.wait-title {
    min-width: 0;
    overflow-wrap: anywhere;
}

.log {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
</style>
