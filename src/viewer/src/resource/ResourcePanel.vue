<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {opening, peek, route, shareAddress, unpeek} from "../route.js";
import {render} from "../text/index.js";
import Skeleton from "../kit/Skeleton.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TaskInspector from "../tasks/TaskInspector.vue";
import AgentFacts from "./AgentFacts.vue";
import MemoryFacts from "./MemoryFacts.vue";
import WorkerFacts from "./WorkerFacts.vue";
import TextDetails from "./TextDetails.vue";
import CommentedRow from "./CommentedRow.vue";
import QuickCommentBar from "../kit/QuickCommentBar.vue";
import {useTextComments} from "../composables/textComments.js";
import PlanInspector from "./PlanInspector.vue";
import RowMoves from "./RowMoves.vue";
import {cliOf, fieldsOf, titleOf} from "../domain/resourceKinds.js";

// the inspector: the row the address opens, over the page, as version 4's side panel drew it; each opened row stacks on the one before
const props = defineProps({read: {type: Function, required: true}});

const opened = computed(() => route.value.open);
const kind = computed(() => (opened.value ? cliOf(opened.value.table) : ""));
const row = ref(null);
const failure = ref("");
let reading = 0;

const LONG_KINDS = new Set(["plan", "doc", "report"]);
const OWN_INSPECTORS = new Set(["task", "plan"]);
const TEXT_KINDS = new Set(["question", "memory"]);
const commentable = computed(() => kind.value === "doc" || kind.value === "report");
const textComments = useTextComments(() => (commentable.value && row.value ? {kind: kind.value, id: opened.value.id, title: row.value.title} : {}), (line) => props.read(line));
const taskComments = ref(false);
const wide = computed(() => LONG_KINDS.has(kind.value) || (kind.value === "task" && taskComments.value));
const title = computed(() => titleOf(kind.value, row.value, opened.value?.id));
const text = computed(() => row.value?.body || row.value?.brief || (TEXT_KINDS.has(kind.value) ? row.value?.text : "") || "");
const html = computed(() => (text.value ? render(text.value, {env: "", rowNames: false}) : ""));
const fields = computed(() => fieldsOf(row.value));

async function load() {
    const open = opened.value;
    const turn = ++reading;
    row.value = null;
    failure.value = "";
    if (!open || OWN_INSPECTORS.has(cliOf(open.table))) return;
    const name = cliOf(open.table);
    const answer = await props.read([name, "show", String(open.id)]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    row.value = answer.ok ? answer.value : null;
}

watch(() => `${opened.value?.table}:${opened.value?.id}`, load, {immediate: true});

const close = () => opening([]);
const closeOnEscape = (event) => event.key === "Escape" && opened.value && unpeek();
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <Teleport to="body">
        <Transition name="side" appear>
            <div v-if="opened" class="veil" @click.self="close">
                <aside :class="['panel', {wide, task: kind === 'task'}]" role="dialog" :aria-label="title" data-resource-panel>
                    <SwitchCase :value="kind">
                        <template #task>
                            <TaskInspector lone :backed="route.stack.length > 1" :id="opened.id" :read="read" @close="close" @back="unpeek" @select="(id) => peek('tasks', id)" @comments="taskComments = $event" />
                        </template>
                        <template #plan>
                            <PlanInspector :backed="route.stack.length > 1" :id="opened.id" :read="read" @close="close" @back="unpeek" @select="(id) => peek('tasks', id)" />
                        </template>
                        <template #default>
                        <header class="head">
                            <template v-if="route.stack.length > 1">
                                <button type="button" class="head-button" data-resource-back aria-label="Back" @click="unpeek">←</button>
                            </template>
                            <div class="names">
                                <p class="kind">{{ kind }} {{ opened.id }}<template v-if="row?.state"> · {{ row.state }}</template></p>
                                <h2 data-resource-title>{{ title }}</h2>
                                <template v-if="row?.abstract">
                                    <p class="abstract">{{ row.abstract }}</p>
                                </template>
                            </div>
                            <template v-if="kind === 'doc' || kind === 'report'">
                                <a class="head-button head-share" data-resource-share :href="shareAddress(`${opened.table}:${opened.id}`)">Share</a>
                            </template>
                            <button type="button" class="head-button" data-resource-close aria-label="Close the panel" @click="close">×</button>
                        </header>
                        <CommentedRow :open="commentable && textComments.open.value" :comments="textComments.comments.value" :words="textComments.words" @close="textComments.open.value = false">
                        <div class="body">
                            <template v-if="failure">
                                <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
                            </template>
                            <template v-else-if="!row">
                                <Skeleton />
                            </template>
                            <template v-else>
                                <template v-if="html">
                                    <div class="md text" data-resource-text v-html="html" />
                                </template>
                                <template v-if="kind === 'agent'">
                                    <AgentFacts :id="opened.id" :read="read" />
                                    <template v-if="row.role === 'worker'">
                                        <WorkerFacts :id="opened.id" :read="read" />
                                    </template>
                                </template>
                                <template v-if="kind === 'memory'">
                                    <MemoryFacts :id="opened.id" :read="read" />
                                </template>
                                <template v-if="kind === 'doc' || kind === 'report'">
                                    <TextDetails :kind="kind" :id="opened.id" :row="row" :read="read" @changed="load" />
                                </template>
                                <section class="section" data-resource-fields>
                                    <template v-for="[name, value] in fields" :key="name">
                                        <p class="field-name">{{ name }}</p>
                                        <p class="field-value">{{ value }}</p>
                                    </template>
                                </section>
                            </template>
                        </div>
                        </CommentedRow>
                        <template v-if="commentable && row">
                            <QuickCommentBar :send="textComments.send" :count="textComments.comments.value.length" @show="textComments.open.value = !textComments.open.value" />
                        </template>
                        <RowMoves :kind="kind" :id="opened.id" :row="row" :read="read" @done="load" />
                        </template>
                    </SwitchCase>
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.head-share {
    width: auto;
    padding: 0 8px;
    margin-right: 8px;
    color: var(--text-2);
    font-size: 12px;
    text-decoration: none;
}

.veil {
    position: fixed;
    z-index: 40;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
}

.panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: min(480px, 100vw);
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.4);
}

.panel.task {
    width: min(640px, 100vw);
}

.panel.wide {
    width: min(760px, 100vw);
}

.side-enter-active,
.side-leave-active {
    transition:
        background 0.24s ease,
        backdrop-filter 0.24s ease;
}

.side-enter-active .panel,
.side-leave-active .panel {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.side-enter-from,
.side-leave-to {
    background: transparent;
    backdrop-filter: blur(0);
}

.side-enter-from .panel,
.side-leave-to .panel {
    transform: translateX(100%);
}

.head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 12px 14px 16px;
    border-bottom: 1px solid var(--border);
}

.head-button {
    flex: none;
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font-size: 16px;
    cursor: pointer;
}

.head-button:hover {
    background: var(--hover);
    color: var(--text);
}

.names {
    flex: 1;
    min-width: 0;
}

.kind {
    margin: 0 0 2px;
    color: var(--text-3);
    font-size: 11.5px;
}

h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
}

.abstract {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
}

.body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 28px;
}

.text {
    line-height: 1.55;
    overflow-wrap: anywhere;
}

.section {
    margin-top: 20px;
}

h3 {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 600;
}

.note {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12.5px;
    line-height: 1.45;
}

.line {
    display: flex;
    gap: 12px;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.line:hover {
    background: var(--hover);
    color: var(--text);
}

.line-title {
    min-width: 0;
    overflow-wrap: anywhere;
}

.line .note {
    flex: none;
    margin: 0;
}

.field-name {
    margin: 12px 0 2px;
    color: var(--text-3);
    font-size: 11.5px;
}

.field-value {
    margin: 0;
    font-size: 13px;
    overflow-wrap: anywhere;
}

.failure {
    margin: 0 0 8px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
