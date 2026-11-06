<script setup>
import {computed, ref, watch} from "vue";
import InspectorSections from "../windows/InspectorSections.vue";
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
import TaskDetails from "./TaskDetails.vue";
import TaskLog from "./TaskLog.vue";
import CommentSide from "../resource/CommentSide.vue";
import Segmented from "../kit/Segmented.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import {useTextComments} from "../composables/textComments.js";
import ResourceLinks from "../../kit/ResourceLinks.vue";

const props = defineProps({
    id: {type: Number, required: true},
    read: {type: Function, required: true},
    lone: Boolean,
    stepped: Boolean,
    backed: Boolean,
    changes: {type: Number, default: 0},
});
const emit = defineEmits(["close", "step", "select", "back"]);
const task = ref(null);
const place = ref(null);
const graph = ref(null);
const failure = ref("");
const refusal = ref("");
const menu = ref(null);
const footer = ref(null);
const tab = ref("details");
const TABS = [
    {key: "details", label: "Details"},
    {key: "comments", label: "Comments"},
    {key: "log", label: "Log"},
];
const textComments = useTextComments(
    () => (task.value ? {noun: "task", id: props.id, title: task.value.title} : {}),
    (line) => props.read(line)
);
let reading = 0;

const crumb = computed(() => {
    if (!place.value?.plan_id) return "Not in a plan";
    return place.value.phase_total > 1
        ? `Plan ${place.value.plan_id} › Phase ${place.value.phase_number}: ${place.value.phase_title}`
        : `Plan ${place.value.plan_id}: ${place.value.plan_title}`;
});

async function load() {
    const turn = ++reading;
    const [answer, where, chain] = await Promise.all([
        props.read(["task", "inspect", String(props.id)]),
        props.read(["plan", "place", String(props.id)]),
        props.read(["task", "graph"]),
    ]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    task.value = answer.ok ? answer.value : null;
    place.value = where.ok ? where.value : null;
    graph.value = chain.ok ? chain.value : null;
}

watch(
    () => props.id,
    () => {
        task.value = null;
        place.value = null;
        graph.value = null;
        menu.value = null;
        tab.value = "details";
        load();
    },
    {immediate: true}
);
watch(() => props.changes, load);
watch(textComments.open, (open) => {
    if (open) tab.value = "comments";
});

async function setPriority(priority) {
    const originalPriority = task.value.priority;
    task.value.priority = Number(priority);
    const answer = await props.read(["task", "edit", String(props.id), "--priority", priority]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) return load();
    task.value.priority = originalPriority;
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
                <Btn small title="Previous task (K)" aria-label="Previous task" @click="emit('step', -1)">
                    <Icon name="up" :size="13" />
                </Btn>
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
            <RowMoves ref="footer" noun="task" :id="id" :row="task" :read="read" @done="load" />
            <header class="summary">
                <div class="stamp">
                    Task {{ task.id }} · updated
                    <TimeAgo :at="updatedAt(task)" />
                </div>
                <h3 class="title" data-resource-title>{{ task.title }}</h3>
            </header>
            <div class="tabs" data-task-tabs>
                <Segmented :options="TABS" :value="tab" @pick="tab = $event" />
            </div>
            <div class="panels">
                <SwitchCase :value="tab">
                    <template #details>
                        <TaskDetails
                            :task="task"
                            :place="place"
                            :graph="graph"
                            :refusal="refusal"
                            @status="openStatus"
                            @priority="setPriority"
                            @select="emit('select', $event)"
                        />
                        <InspectorSections slot-name="inspector.task" :row="task" />
                        <ResourceLinks model="task" :id="id" :read="read" :changes="changes" @open="emit('select', $event)" />
                    </template>
                    <template #comments>
                        <CommentSide below :comments="textComments.comments.value" :words="textComments.words" :more="Boolean(textComments.nextPage.value)" :loading="textComments.loading.value" :failure="textComments.failure.value" @more="textComments.loadMore" @close="tab = 'details'" />
                    </template>
                    <template #log><TaskLog :id="id" :read="read" :changes="changes" /></template>
                </SwitchCase>
            </div>
            <QuickCommentBar :send="textComments.send" :count="textComments.total.value" @show="tab = 'comments'" />
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

.stamp {
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

.summary {
    padding: 18px 20px 0;
}
.tabs {
    padding: 0 20px 12px;
    border-bottom: 1px solid var(--border);
}
.panels {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}
.panels :deep(.comment-side) {
    flex: 1;
    width: auto;
    border: 0;
}
</style>
