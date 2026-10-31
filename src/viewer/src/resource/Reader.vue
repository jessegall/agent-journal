<script setup>
import {meta} from "../domain/tables.js";
import {computed, provide, ref, watch, watchEffect} from "vue";
import SidePanel from "../kit/SidePanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route, unpeek} from "../route.js";
import {holding, isWhole, rows, whole} from "../sync/rows.js";
import ResourceBody from "./ResourceBody.vue";
import DocumentPage from "./DocumentPage.vue";
import PlanPage from "./PlanPage.vue";
import TaskPanel from "../tasks/TaskPanel.vue";
import Dialog from "../kit/Dialog.vue";
import AgentPage from "./AgentPage.vue";
import WorkerPage from "./WorkerPage.vue";
import VerifierPage from "./VerifierPage.vue";
import Comments from "./Comments.vue";
import AgentBar from "../chat/AgentBar.vue";
import Thread from "../chat/Thread.vue";
import {scopeIn} from "../composables/scope.js";
import {useKept} from "../composables/kept.js";
import {usePoll} from "../composables/poll.js";
import {useWindowEvent} from "../composables/windowEvent.js";
import {useRowsShown} from "../composables/rowsShown.js";

const props = defineProps({
    table: String,
    id: Number,
    env: {type: String, default: ""},
    depth: {type: Number, default: 0},
    over: Boolean,
    leaving: Boolean,
});
const emit = defineEmits(["gone"]);
const scope = props.env && props.env !== route.value.env ? scopeIn(props.env) : null;
if (scope) provide("scope", scope);
const rowsHere = scope ? scope.rows : rows;
// the row as read by id, whose relations its list leaves out, under the live row kept in step with the journal
const {rows: shown} = useRowsShown(() => (scope ? "" : props.table), computed(() => [props.id]));
const stored = computed(() => {
    const row = (props.table ? rowsHere(props.table).find((r) => r.id === props.id) : null) || null;
    return row && shown.value[0] ? {...shown.value[0], ...row} : row;
});
const resource = useKept(stored, () => `${props.table}:${props.id}`);

if (scope) usePoll("reader.elsewhere", {params: () => ({scope, table: props.table, id: props.id})});
watchEffect(() => {
    if (!scope && props.table && props.id && !resource.value) holding(props.table, [props.id]);
});
watchEffect(() => {
    if (!scope && resource.value && !isWhole(resource.value)) whole(props.table, props.id).catch((error) => console.error(error));
});
const kind = computed(() => (props.table ? meta(props.table) : null));
const kindTitle = computed(() => (kind.value ? kind.value.title : "item"));
const takesComments = computed(() => !!kind.value?.takes_comments);
const focusComment = computed(() => (props.depth ? 0 : route.value.open?.comment || 0));
const SHAPES = {plans: "plan", agents: "agent", workers: "worker", verifiers: "verifier"};
const DIALOG_PAGES = {agent: AgentPage, worker: WorkerPage, verifier: VerifierPage};
const shape = computed(() => (!props.table ? "" : SHAPES[props.table] || kind.value?.view));
const WIDTHS = {small: "normal", wide: "wide"};
const discussing = ref(false);
provide("discussion", {on: discussing, toggle: () => (discussing.value = !discussing.value)});
watch(
    () => `${props.table}:${props.id}`,
    () => (discussing.value = false)
);
const panelWidth = computed(() => (discussing.value ? "full" : WIDTHS[shape.value] || "page"));
const panel = computed(() => (["small", "wide", "check"].includes(shape.value) ? "inspector" : shape.value));
const close = () => (route.value.open ? unpeek() : go(props.table));
useWindowEvent("keydown", (event) => {
    if (event.key !== "Escape" || !route.value.open || route.value.open.table !== props.table || route.value.open.id !== props.id) return;
    if (event.target.matches("input, textarea") && event.target.value) return;
    event.preventDefault();
    unpeek();
});
const swapping = ref(false);
let settle = 0;
watch(
    () => `${props.table}:${props.id}`,
    (now, before) => {
        if (!before || !resource.value || before.startsWith(":")) return;
        swapping.value = true;
        clearTimeout(settle);
        settle = setTimeout(() => (swapping.value = false), 260);
    }
);
</script>

<template>
    <template v-if="DIALOG_PAGES[shape]">
        <Dialog large bare :open="!!resource && !leaving" @dismiss="close" @close="emit('gone')">
            <template v-if="resource">
                <DocumentPage :resource="resource" :focus="focusComment" read-only @close="close">
                    <component :is="DIALOG_PAGES[shape]" :resource="resource" @close="close" />
                </DocumentPage>
            </template>
        </Dialog>
    </template>
    <template v-else>
        <SidePanel
            :open="!!resource && !leaving"
            :width="panelWidth"
            :depth="depth"
            :over="over"
            :close-label="`Close the ${kindTitle.toLowerCase()}`"
            @dismiss="close"
            @close="emit('gone')"
        >
            <template v-if="table === 'tasks' && resource">
                <TaskPanel :task="resource" @close="close" />
            </template>
            <template v-else-if="panel === 'inspector'">
                <div :class="['inspector', {swapping, 'focusing-comment': focusComment}]">
                    <div class="inspector-pages">
                        <Transition name="inspector-page">
                            <div :key="`${resource.table}:${resource.id}`" :class="['inspector-page', shape]">
                                <template v-if="swapping">
                                    <div class="skeleton">
                                        <span class="blank short" />
                                        <span class="blank wide" />
                                        <span class="blank" />
                                        <span class="blank" />
                                        <span class="blank half" />
                                    </div>
                                </template>
                                <template v-else>
                                    <ResourceBody :resource="resource" :comment-composer="false" :focus="focusComment" @close="close" />
                                </template>
                            </div>
                        </Transition>
                    </div>
                    <template v-if="takesComments">
                        <Comments :resource="resource" :show-thread="false" />
                    </template>
                </div>
            </template>
            <template v-else>
                <div :class="['page', {discussing}]">
                    <template v-if="discussing">
                        <div class="discussion-chat">
                            <AgentBar />
                            <Thread />
                        </div>
                    </template>
                    <SwitchCase :value="shape">
                        <template #plan>
                            <DocumentPage :resource="resource" :focus="focusComment" @close="close">
                                <PlanPage :resource="resource" @close="close" />
                            </DocumentPage>
                        </template>
                        <template #document>
                            <DocumentPage :resource="resource" :focus="focusComment" @close="close" />
                        </template>
                        <template #default>
                            <ResourceBody :resource="resource" @close="close" />
                        </template>
                    </SwitchCase>
                </div>
            </template>
        </SidePanel>
    </template>
</template>

<style scoped>
.damaged {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 20px;
}

.inspector {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}
.inspector::before {
    content: "";
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--progress);
    opacity: 0;
}

.inspector.swapping::before {
    animation: inspector-progress 0.26s ease-out forwards;
}

.inspector.focusing-comment .inspector-pages {
    flex: 0 0 42%;
}

.inspector.focusing-comment > :deep(.comments) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    margin: 0;
    padding: 16px 16px 8px;
}

.inspector-pages {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: visible;
}

.inspector-page {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-bottom: 44px;
    background: var(--bg);
}

.inspector-page.small {
    width: min(480px, 100vw);
}

.inspector-page.wide {
    width: min(760px, 100vw);
}

.inspector > :deep(.comment-write) {
    position: relative;
    z-index: 3;
    flex: none;
    margin: 0;
    padding: 10px 16px 14px;
    border-top: 1px solid var(--border);
    background: var(--bg);
}

.skeleton {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
    padding: 44px 32px;
    animation: skeleton-wait 1.6s ease-in-out infinite;
}

.blank {
    display: block;
    height: 11px;
    border-radius: 99px;
    background: color-mix(in srgb, var(--text-3) 22%, transparent);
}

.blank.short {
    width: 28%;
    height: 9px;
}

.blank.wide {
    width: 88%;
    height: 18px;
    margin-bottom: 8px;
}

.blank.half {
    width: 55%;
}

@keyframes skeleton-wait {
    0%,
    100% {
        opacity: 0.45;
    }

    50% {
        opacity: 1;
    }
}

@keyframes inspector-progress {
    0% {
        width: 0;
        opacity: 1;
    }

    75% {
        width: 82%;
        opacity: 1;
    }

    100% {
        width: 100%;
        opacity: 0;
    }
}

.inspector-page-enter-active,
.inspector-page-leave-active {
    transition:
        transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.18s ease;
}

.inspector-page-leave-active {
    position: absolute;
}

.inspector-page-enter-from {
    opacity: 0;
    transform: translateX(32px);
}

.inspector-page-leave-to {
    opacity: 0;
    transform: translateX(-32px);
}
.page {
    min-height: 100%;
}

.page.discussing {
    display: grid;
    grid-template-columns: minmax(360px, 2fr) minmax(0, 3fr);
    height: 100%;
    min-height: 0;
}

.page.discussing > :deep(.document) {
    min-width: 0;
}

.discussion-chat {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-right: 1px solid var(--border);
    background: var(--bg);
}

.discussion-chat > :deep(.thread) {
    padding: 0 12px;
}
.page > :deep(.body) {
    max-width: 800px;
    margin: 0 auto;
    min-height: 100%;
    padding: 36px 32px 0;
}

.page > :deep(.body) > .head {
    margin: -36px -32px 0;
    padding: 36px 32px 8px;
}

.side-leave-active :deep(.document-body),
.side-leave-active :deep(.document-aside) {
    animation: none;
    transition:
        transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.22s ease-in;
}

.side-leave-to :deep(.document-body) {
    opacity: 0;
    transform: translateX(-28px);
}

.side-leave-to :deep(.document-aside) {
    opacity: 0;
    transform: translateX(28px);
}
</style>
