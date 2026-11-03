<script setup>
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import BackButton from "../kit/BackButton.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import Skeleton from "../kit/Skeleton.vue";
import RowMoves from "../resource/RowMoves.vue";
import {updatedAt} from "../domain/row.js";
import TimeAgo from "../../kit/TimeAgo.vue";
import TaskStatusIcon from "./TaskStatusIcon.vue";
import {statusIcon} from "../domain/taskStatus.js";
import TaskFacts from "./TaskFacts.vue";
import TaskSections from "./TaskSections.vue";
import CommentedRow from "../resource/CommentedRow.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import {useTextComments} from "../composables/textComments.js";

// one task as version 4's inspector drew it: where it stands, why it stopped, what it waits on, its brief and log, and what can be done to it
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, lone: Boolean, stepped: Boolean, backed: Boolean, changes: {type: Number, default: 0}});
const emit = defineEmits(["close", "step", "select", "back"]);
const task = ref(null);
const place = ref(null);
const failure = ref("");
const refusal = ref("");
const menu = ref(null);
const footer = ref(null);
const textComments = useTextComments(() => (task.value ? {kind: "task", id: props.id, title: task.value.title} : {}), (line) => props.read(line));
let reading = 0;

const iconOf = statusIcon;
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
    menu.value = null;
    load();
}, {immediate: true});
watch(() => props.changes, load);

async function setPriority(priority) {
    const before = task.value.priority;
    task.value.priority = Number(priority);
    const answer = await props.read(["task", "edit", String(props.id), "--priority", priority]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) return load();
    task.value.priority = before;
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
                <BackButton @back="emit('back')" />
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
            <RowMoves ref="footer" kind="task" :id="id" :row="task" :read="read" @done="load" />
            <CommentedRow stacked :open="textComments.open.value" :comments="textComments.comments.value" :words="textComments.words" @close="textComments.open.value = false">
            <div :key="task.id" class="body">
                <div class="stamp">Task {{ task.id }} · updated <TimeAgo :at="updatedAt(task)" /></div>
                <h3 class="title" data-resource-title>{{ task.title }}</h3>
                <div :class="['state-line', iconOf(task.state)]">
                    <button type="button" class="state" data-task-state title="Change the status (S)" @click="openStatus($event.currentTarget)">
                        <TaskStatusIcon :status="iconOf(task.state)" />
                        {{ label(task.state) }}
                    </button>
                    <span class="since">since <TimeAgo :at="updatedAt(task)" /></span>
                </div>
                <template v-if="task.state === 'blocked'">
                    <section class="reason" data-task-reason>
                        <span class="label">Blocked, waiting on</span>
                        <p class="text">{{ task.reason || "Other tasks" }}</p>
                        <template v-if="task.openers?.length">
                            <p class="note" data-task-openers>Opens by itself when {{ task.openers.join(" or ") }}.</p>
                        </template>
                        <template v-else>
                            <p class="note">Nothing opens it by itself. Unblock it when that is done.</p>
                        </template>
                    </section>
                </template>
                <template v-else-if="task.state === 'cancelled' && task.reason">
                    <section class="reason" data-task-reason>
                        <span class="label">Why it was cancelled</span>
                        <p class="text">{{ task.reason }}</p>
                    </section>
                </template>
                <TaskFacts :task="task" :place="place" :refusal="refusal" @priority="setPriority" />
                <TaskSections :task="task" @select="emit('select', $event)" />
            </div>
            </CommentedRow>
            <QuickCommentBar :send="textComments.send" :count="textComments.comments.value.length" @show="textComments.open.value = !textComments.open.value" />
        </template>
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
    width: 560px;
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

.text {
    margin: 0;
    color: var(--text-2);
    white-space: pre-wrap;
    text-wrap: pretty;
}

.note {
    margin: 6px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

</style>
