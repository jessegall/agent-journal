<script setup>
import {shareAddress} from "../route.js";
import PlanReviews from "./PlanReviews.vue";
import PlanTimeline from "./PlanTimeline.vue";
import Segmented from "../kit/Segmented.vue";
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import BackButton from "../kit/BackButton.vue";
import CloseButton from "../kit/CloseButton.vue";
import Dot from "../kit/Dot.vue";
import Folded from "../kit/Folded.vue";
import Icon from "../kit/Icon.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import Skeleton from "../kit/Skeleton.vue";
import {render} from "../text/index.js";
import RowMoves from "./RowMoves.vue";
import CommentedRow from "./CommentedRow.vue";
import PlanCritique from "./PlanCritique.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import {useTextComments} from "../composables/textComments.js";

// one plan as version 4's plan page drew it: its state and phase, how far it has come, what can be done to it, its text, and its phases as cards of tasks
const CLOSED = new Set(["completed", "cancelled"]);
const props = defineProps({id: {type: Number, required: true}, read: {type: Function, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back", "select"]);
const VIEWS = [
    {key: "phases", label: "Phases"},
    {key: "timeline", label: "Timeline"},
];
const view = ref("phases");
const plan = ref(null);
const failure = ref("");
const critiquing = ref(false);
const textComments = useTextComments(() => (plan.value ? {kind: "plan", id: props.id, title: plan.value.title} : {}), (line) => props.read(line));
let reading = 0;

const html = computed(() => (plan.value?.brief ? render(plan.value.brief, {env: "", rowNames: false}) : ""));
const label = (state) => state.slice(0, 1).toUpperCase() + state.slice(1);
const closedCount = (phase) => phase.tasks.filter((task) => CLOSED.has(task.state)).length;
const isDone = (phase) => phase.tasks.length > 0 && closedCount(phase) === phase.tasks.length;

async function load() {
    const turn = ++reading;
    const answer = await props.read(["plan", "inspect", String(props.id)]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    plan.value = answer.ok ? answer.value : null;
}

watch(() => props.id, () => {
    plan.value = null;
    load();
}, {immediate: true});
</script>

<template>
    <article class="plan-inspector" data-plan-inspector>
        <header class="top">
            <template v-if="backed">
                <BackButton @back="emit('back')" />
            </template>
            <span class="kind"><Icon name="flag" :size="13" /> Plan {{ id }}</span>
            <template v-if="plan">
                <span :class="['status', plan.state]" data-plan-status>
                    {{ label(plan.state) }}<template v-if="plan.current_phase"> · phase {{ plan.current_phase }} of {{ plan.phases.length }}</template>
                </span>
            </template>
            <span class="grow" />
            <a class="share-link" data-resource-share :href="shareAddress(`plans:${id}`)">Share</a>
            <CloseButton title="Close the plan" data-resource-close @click="emit('close')" />
        </header>
        <CommentedRow stacked :open="textComments.open.value" :comments="textComments.comments.value" :words="textComments.words" @close="textComments.open.value = false">
        <div class="scroll">
            <template v-if="failure">
                <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
            </template>
            <template v-else-if="!plan">
                <Skeleton />
            </template>
            <template v-else>
                <h2 class="title" data-resource-title>{{ plan.title }}</h2>
                <template v-if="plan.reason">
                    <p class="note" data-plan-reason>{{ plan.state === "cancelled" ? "Cancelled" : "Blocked" }}: {{ plan.reason }}</p>
                </template>
                <template v-if="plan.total">
                    <div class="overall" data-plan-progress>
                        <ProgressBar :value="plan.finished" :max="plan.total" />
                        <span class="overall-figure">{{ plan.finished }} of {{ plan.total }} done</span>
                    </div>
                </template>
                <RowMoves inline kind="plan" :id="id" :row="plan" :read="read" @done="load" />
                <template v-if="plan.state === 'ready'">
                    <div class="plan-critique">
                        <Btn small bordered data-plan-critique-open @click="critiquing = true">Ask for a critique</Btn>
                    </div>
                </template>
                <template v-if="html">
                    <div class="brief">
                        <Folded :name="`plans:${id}:brief`" :at="220" :keep="160">
                            <div class="md" data-resource-text v-html="html" />
                        </Folded>
                    </div>
                </template>
                <div class="plan-views">
                    <Segmented :options="VIEWS" :value="view" @pick="view = $event" />
                </div>
                <template v-if="view === 'timeline'">
                    <PlanTimeline :id="id" :read="read" @select="emit('select', $event)" />
                </template>
                <ol v-show="view === 'phases'" class="phases">
                    <template v-for="(phase, index) in plan.phases" :key="phase.id">
                        <li :class="['phase', {current: index + 1 === plan.current_phase, done: isDone(phase)}]" data-resource-phase>
                            <div class="phead">
                                <span class="mark"><Icon :name="isDone(phase) ? 'check' : 'circle'" :size="14" /></span>
                                <span class="ptitle">{{ index + 1 }}. {{ phase.title }}</span>
                                <span class="phead-end">
                                    <template v-if="phase.checkpoint">
                                        <span class="checkpoint">checkpoint</span>
                                    </template>
                                    <span class="progress">{{ closedCount(phase) }}/{{ phase.tasks.length }}</span>
                                </span>
                            </div>
                            <template v-if="phase.goal">
                                <div class="when">{{ phase.goal }}</div>
                            </template>
                            <template v-for="task in phase.tasks" :key="task.id">
                                <button type="button" :class="['row', task.state]" data-resource-task @click="emit('select', task.id)">
                                    <Dot :kind="task.state" />
                                    <span class="row-id">#{{ task.id }}</span>
                                    <span class="row-title">{{ task.title }}</span>
                                    <template v-if="task.helper_id">
                                        <span class="holder" data-plan-agent>Agent {{ task.helper_id }}</span>
                                    </template>
                                </button>
                            </template>
                        </li>
                    </template>
                </ol>
                <PlanReviews :id="id" :read="read" />
            </template>
        </div>
        </CommentedRow>
        <template v-if="plan">
            <QuickCommentBar :send="textComments.send" :count="textComments.comments.value.length" @show="textComments.open.value = !textComments.open.value" />
        </template>
        <template v-if="critiquing">
            <PlanCritique :plan="plan" :read="read" @close="critiquing = false" />
        </template>
    </article>
</template>

<style scoped>
.share-link {
    color: var(--text-2);
    font-size: 12px;
    text-decoration: none;
}

.plan-views {
    display: flex;
    margin: 16px 0 0;
}

.holder {
    flex: none;
    margin-left: auto;
    padding: 0 7px;
    border-radius: 99px;
    background: var(--hover);
    color: var(--text-3);
    font-size: 11px;
    line-height: 18px;
}

.plan-critique {
    margin-top: 8px;
}

.plan-inspector {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.top {
    display: flex;
    flex: none;
    align-items: center;
    gap: 12px;
    padding: 14px 12px 8px 24px;
    color: var(--text-3);
    font-size: 11.5px;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    font-size: 12px;
}

.status {
    color: var(--text-2);
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.status.started {
    color: var(--progress);
}

.status.blocked {
    color: var(--blocking);
}

.status.approved {
    color: var(--created);
}

.grow {
    flex: 1;
}

.scroll {
    flex: 1;
    overflow: auto;
    padding: 0 24px 28px;
    scrollbar-width: thin;
}

.title {
    margin: 6px 0 4px;
    font-size: 22px;
    font-weight: 600;
}

.note {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 12px;
}

.failure {
    margin: 12px 0;
    color: var(--danger);
    font-size: 12.5px;
}

.overall {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 14px;
}

.overall :deep(.track) {
    flex: 1;
}

.overall-figure {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.brief {
    margin: 0 0 20px;
    color: var(--text-2);
    line-height: 1.55;
    overflow-wrap: anywhere;
}

.phases {
    margin: 0;
    padding: 0;
    list-style: none;
}

.phase {
    margin-bottom: 8px;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.phase.current {
    border-color: var(--accent);
}

.phase.done {
    opacity: 0.7;
}

.phead {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mark {
    display: inline-flex;
    color: var(--accent-text);
}

.ptitle {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.phead-end {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
}

.checkpoint {
    color: var(--blocking);
    font-size: 11.5px;
}

.progress {
    color: var(--text-3);
    font-size: 12px;
}

.when {
    margin: 2px 0 6px 24px;
    color: var(--text-3);
    font-size: 12.5px;
}

.row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 4px 6px 4px 24px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.row:hover {
    color: var(--text);
}

.row.completed .row-title,
.row.cancelled .row-title {
    color: var(--text-3);
}

.row.cancelled .row-title {
    text-decoration: line-through;
}

.row-id {
    color: var(--text-3);
    font-size: 12px;
}
</style>
