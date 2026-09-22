<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import SidePanel from "../kit/SidePanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route, swap, unpeek} from "../route.js";
import {meta} from "../state/store.js";
import {holding, rows} from "../sync/rows.js";
import ResourceBody from "./ResourceBody.vue";
import DocumentPage from "./DocumentPage.vue";
import PlanPage from "./PlanPage.vue";
import Revisions from "./Revisions.vue";
import CollectionPage from "./CollectionPage.vue";
import AgentPage from "./AgentPage.vue";
import Comments from "./Comments.vue";

const props = defineProps({type: String, n: Number, depth: {type: Number, default: 0}, over: Boolean, leaving: Boolean});
const emit = defineEmits(["gone"]);
const resource = computed(() => (props.type ? rows(props.type).find((r) => r.n === props.n) : null) || null);
watchEffect(() => {
    if (props.type && props.n && !resource.value) holding(props.type, [props.n]);
});
watchEffect(() => {
    const part = resource.value && resource.value.data.part_of;
    if (!part || props.depth) return;
    const [type, n] = part.split(":");
    if (route.value.open) swap(type, Number(n));
    else go(route.value.env, type, Number(n));
});
const focusComment = computed(() => (props.depth ? 0 : route.value.open?.comment || 0));
const shape = computed(() =>
    !props.type ? "" : ["plan", "agent", "collection"].includes(props.type) ? props.type : meta(props.type).view
);
const panel = computed(() => (["small", "wide"].includes(shape.value) ? "inspector" : shape.value));
const close = () => (route.value.open ? unpeek() : go(route.value.env, props.type));
const swapping = ref(false);
let settle = 0;
watch(
    () => `${props.type}:${props.n}`,
    (now, before) => {
        if (!before || !resource.value || before.startsWith(":")) return;
        swapping.value = true;
        clearTimeout(settle);
        settle = setTimeout(() => (swapping.value = false), 260);
    }
);
</script>

<template>
    <SidePanel
        :open="!!resource && !leaving"
        :width="panel === 'inspector' ? (shape === 'wide' ? 'wide' : 'normal') : 'page'"
        :depth="depth"
        :over="over"
        @dismiss="close"
        @close="emit('gone')"
    >
        <template v-if="panel === 'inspector'">
            <div :class="['inspector', {swapping, 'focusing-comment': focusComment}]">
                <div class="inspector-pages">
                    <Transition name="inspector-page">
                        <div :key="resource.ref" :class="['inspector-page', shape]">
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
                                <ResourceBody :resource="resource" :comment-composer="false" @close="close" />
                            </template>
                        </div>
                    </Transition>
                </div>
                <Comments :resource="resource" :show-thread="!!focusComment" :focus="focusComment" />
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
                    <template #collection>
                        <DocumentPage :resource="resource" :focus="focusComment" :shown="resource.refs" @close="close">
                            <CollectionPage :resource="resource" @close="close" />
                        </DocumentPage>
                    </template>
                    <template #agent>
                        <DocumentPage :resource="resource" :focus="focusComment" @close="close">
                            <AgentPage :resource="resource" @close="close" />
                        </DocumentPage>
                    </template>
                    <template #document>
                        <DocumentPage :resource="resource" :focus="focusComment" @close="close">
                            <template v-if="resource.data.revisions">
                                <Revisions :resource="resource" @close="close" />
                            </template>
                        </DocumentPage>
                    </template>
                    <template #default>
                        <ResourceBody :resource="resource" @close="close" />
                    </template>
                </SwitchCase>
            </div>
        </template>
    </SidePanel>
</template>

<style scoped>
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
    padding: 16px 20px 8px;
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
    background: var(--bg);
}

.inspector-page.small {
    width: min(460px, 100vw);
}

.inspector-page.wide {
    width: min(760px, 100vw);
}

.inspector > :deep(.comment-write) {
    position: relative;
    z-index: 3;
    flex: none;
    margin: 0;
    padding: 10px 20px 14px;
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
