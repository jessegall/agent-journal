<script setup>
import {meta} from "../domain/tables.js";
import {computed, provide, ref, watch, watchEffect} from "vue";
import SidePanel from "../kit/SidePanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route, unpeek} from "../route.js";
import {PAGE, holding, isWhole, rows, whole} from "../sync/rows.js";
import ResourceBody from "./ResourceBody.vue";
import DocumentPage from "./DocumentPage.vue";
import PlanPage from "./PlanPage.vue";
import Dialog from "../kit/Dialog.vue";
import AgentPage from "./AgentPage.vue";
import WorkerPage from "./WorkerPage.vue";
import Comments from "./Comments.vue";
import {scopeIn} from "../composables/scope.js";
import {useKept} from "../composables/kept.js";
import {usePoll} from "../composables/poll.js";
import {useWindowEvent} from "../composables/windowEvent.js";

const props = defineProps({
    table: String,
    id: Number,
    env: {type: String, default: ""},
    depth: {type: Number, default: 0},
    over: Boolean,
    leaving: Boolean,
});
const emit = defineEmits(["gone"]);
const ELSEWHERE_EVERY = 5000;
const scope = props.env && props.env !== route.value.env ? scopeIn(props.env) : null;
if (scope) provide("scope", scope);
const rowsHere = scope ? scope.rows : rows;
const stored = computed(() => (props.table ? rowsHere(props.table).find((r) => r.id === props.id) : null) || null);
const resource = useKept(stored, () => `${props.table}:${props.id}`);

async function readElsewhere() {
    await scope.holding(props.table, [props.id]);
    await scope.recent("comments", PAGE);
}
if (scope) usePoll(`elsewhere:${props.env}:${props.table}:${props.id}`, readElsewhere, ELSEWHERE_EVERY);
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
const SHAPES = {plans: "plan", agents: "agent", workers: "worker"};
const DIALOG_PAGES = {agent: AgentPage, worker: WorkerPage};
const shape = computed(() => (!props.table ? "" : SHAPES[props.table] || kind.value?.view));
const WIDTHS = {small: "normal", wide: "wide"};
const panelWidth = computed(() => WIDTHS[shape.value] || "page");
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
                <DocumentPage :resource="resource" :focus="focusComment" @close="close">
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
            <template v-if="panel === 'inspector'">
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
                <div class="page">
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
