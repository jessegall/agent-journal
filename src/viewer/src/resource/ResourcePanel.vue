<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {opening, peek, route, unpeek} from "../route.js";
import {DECLARED_NOUNS} from "./declaredNouns.js";
import InspectorPanel from "./InspectorPanel.vue";
import Skeleton from "../kit/Skeleton.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TaskInspector from "../tasks/TaskInspector.vue";
import AgentInspector from "./agent/AgentInspector.vue";
import DocumentInspector from "./document/DocumentInspector.vue";
import PlanInspector from "./PlanInspector.vue";
import ProcessQueueInspector from "./ProcessQueueInspector.vue";
import {cliOf, titleOf} from "../domain/resourceNouns.js";

// the inspector: the row the address opens, over the page, as version 4's side panel drew it; each opened row stacks on the one before
const props = defineProps({read: {type: Function, required: true}, catalogue: {type: Object, required: true}, environment: {type: String, required: true}, readOnly: Boolean});

const opened = computed(() => route.value.open);
const noun = computed(() => (opened.value ? cliOf(opened.value.table) : ""));
const fullyOpen = ref(false);

// every noun whose old branch is gone is drawn by the shared layout, and so is each noun a later task adds to the set
const OWN_INSPECTORS = new Set(["task", "plan", "test-queue", "agent", "doc", "report"]);
const declared = computed(() => DECLARED_NOUNS.has(noun.value) || !OWN_INSPECTORS.has(noun.value));
const wide = computed(() => noun.value === "plan");
const isDocument = computed(() => noun.value === "doc" || noun.value === "report");
const title = computed(() => titleOf(noun.value, null, opened.value?.id));

const close = () => opening([]);
// focus moves into the panel when it opens and back to what opened it when it closes; Escape closes an open action form first, then the top row
const panel = ref(null);
let opener = null;
watch(() => Boolean(opened.value), async (now) => {
    if (now) {
        opener = document.activeElement;
        await nextTick();
        panel.value?.focus();
        return;
    }
    opener?.focus?.();
    opener = null;
}, {immediate: true});
const closeOnEscape = (event) => event.key === "Escape" && opened.value && !document.querySelector('[role="dialog"][aria-modal="true"]') && unpeek();
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <Teleport to="body">
        <Transition name="side" appear @before-enter="fullyOpen = false" @after-enter="fullyOpen = true">
            <div v-if="opened" :class="['veil', {fades: noun === 'test-queue'}]" @click.self="close">
                <InspectorPanel
                    v-if="declared"
                    ref="panel"
                    :noun="noun"
                    :id="opened.id"
                    :table="opened.table"
                    :read="read"
                    :catalogue="catalogue"
                    :environment="environment"
                    :read-only="readOnly"
                    :backed="route.stack.length > 1"
                    :opening="!fullyOpen"
                    @close="close"
                    @back="unpeek"
                    @open="(row) => peek(row.table, row.id)"
                />
                <aside
                    v-else
                    :class="['panel', {wide, opening: !fullyOpen, task: noun === 'task', document: isDocument, queue: noun === 'test-queue', agent: noun === 'agent'}]"
                    ref="panel"
                    tabindex="-1"
                    role="dialog"
                    :aria-label="title"
                    data-resource-panel
                >
                    <template v-if="!fullyOpen">
                        <div class="panel-opening" data-resource-opening><Skeleton /></div>
                    </template>
                    <SwitchCase :value="noun">
                        <template #agent>
                            <AgentInspector :id="opened.id" :backed="route.stack.length > 1" :read="read" :environment="environment" @close="close" @back="unpeek" />
                        </template>
                        <template #task>
                            <TaskInspector
                                lone
                                :backed="route.stack.length > 1"
                                :id="opened.id"
                                :read="read"
                                @close="close"
                                @back="unpeek"
                                @select="(id) => peek('tasks', id)"
                            />
                        </template>
                        <template #plan>
                            <PlanInspector
                                :backed="route.stack.length > 1"
                                :id="opened.id"
                                :read="read"
                                :environment="environment"
                                :read-only="readOnly"
                                @close="close"
                                @back="unpeek"
                                @select="(id) => peek('tasks', id)"
                                @open="(row) => peek(row.table, row.id)"
                            />
                        </template>
                        <template #test-queue>
                            <ProcessQueueInspector :backed="route.stack.length > 1" :read="read" @close="close" @back="unpeek" />
                        </template>
                        <template #doc>
                            <DocumentInspector
                                :table="opened.table"
                                :id="opened.id"
                                :backed="route.stack.length > 1"
                                :read="read"
                                @close="close"
                                @back="unpeek"
                            />
                        </template>
                        <template #report>
                            <DocumentInspector
                                :table="opened.table"
                                :id="opened.id"
                                :backed="route.stack.length > 1"
                                :read="read"
                                @close="close"
                                @back="unpeek"
                            />
                        </template>
                    </SwitchCase>
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
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

.panel :deep(.panel-opening) {
    position: absolute;
    z-index: 1;
    inset: 0;
    padding: 20px 24px;
}

.panel > :deep(:not(.panel-opening)) {
    transition: opacity 0.18s ease;
}

.panel.opening > :deep(:not(.panel-opening)) {
    opacity: 0;
    transition: none;
}

.panel.queue {
    width: min(640px, 100vw);
    border-left-color: var(--border-2);
}

.veil.fades { background: rgba(0, 0, 0, .45); }
.veil.fades .panel { box-shadow: -20px 0 50px rgba(0, 0, 0, .4); }
@media (prefers-color-scheme: light) {
    .veil.fades { background: rgba(20, 22, 30, .32); }
    .veil.fades .panel { box-shadow: -20px 0 50px rgba(20, 22, 30, .16); }
}
.side-enter-active.fades { transition: opacity 220ms ease; }
.side-leave-active.fades { transition: opacity 160ms ease; }
.side-enter-from.fades, .side-leave-to.fades { opacity: 0; }
.side-enter-active.fades .panel, .side-leave-active.fades .panel { transition: none; }
.side-enter-from.fades .panel, .side-leave-to.fades .panel { transform: none; }
@media (prefers-reduced-motion: reduce) { .side-enter-active.fades, .side-leave-active.fades { transition-duration: 100ms; } }

.panel.task {
    width: min(640px, 100vw);
}

.panel.agent {
    width: min(600px, 100vw);
}

.panel.wide {
    width: min(760px, 100vw);
}

.panel.document {
    width: min(1130px, 100vw);
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

:deep(.resource-noun) {
    margin: 0 0 2px;
    color: var(--text-3);
    font-size: 11.5px;
}

:deep(.resource-title) {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
}

:deep(.resource-abstract) {
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

.failure {
    margin: 0 0 8px;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
