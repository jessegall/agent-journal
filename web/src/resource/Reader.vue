<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route, unpeek} from "../route.js";
import {meta, rows} from "../store.js";
import ResourceBody from "./ResourceBody.vue";
import DocumentPage from "./DocumentPage.vue";
import PlanPage from "./PlanPage.vue";
import AgentPage from "./AgentPage.vue";

const props = defineProps({type: String, n: Number});
const resource = computed(() => (props.type ? rows(props.type).find((r) => r.n === props.n) : null) || null);
const shape = computed(() => (!props.type ? "" : ["plan", "agent"].includes(props.type) ? props.type : meta(props.type).view));
const panel = computed(() => (["small", "wide"].includes(shape.value) ? "inspector" : shape.value));
const close = () => (route.value.open ? unpeek() : go(route.value.env, props.type));
</script>

<template>
    <Transition name="reader">
        <div v-if="resource" :key="panel" :class="['reader', shape]" @click.self="close">
            <Transition name="swap" mode="out-in">
                <div :key="`${type}:${n}`" class="held">
                    <SwitchCase :value="shape">
                        <template #plan>
                            <div class="page">
                                <DocumentPage :resource="resource" @close="close">
                                    <PlanPage :resource="resource" @close="close" />
                                </DocumentPage>
                            </div>
                        </template>
                        <template #agent>
                            <div class="page">
                                <DocumentPage :resource="resource" @close="close">
                                    <AgentPage :resource="resource" @close="close" />
                                </DocumentPage>
                            </div>
                        </template>
                        <template #document>
                            <div class="page"><DocumentPage :resource="resource" @close="close" /></div>
                        </template>
                        <template #default>
                            <aside class="inspector"><ResourceBody :resource="resource" @close="close" /></aside>
                        </template>
                    </SwitchCase>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.reader {
    position: fixed;
    inset: 0;
    z-index: 20;
}
.reader.small,
.reader.wide,
.reader.document,
.reader.plan,
.reader.agent {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
}
.inspector {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(460px, 100%);
    overflow: auto;
    background: var(--bg);
    border-left: 1px solid var(--border);
    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.4);
}
.reader.wide .inspector {
    width: min(760px, 100%);
}

.held {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.held > .inspector,
.held > .page {
    pointer-events: auto;
}

.swap-enter-active,
.swap-leave-active {
    transition: opacity 0.12s ease;
}

.swap-enter-from,
.swap-leave-to {
    opacity: 0;
}
.page {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(1180px, 68%);
    overflow: auto;
    border-left: 1px solid var(--border);
    background: var(--bg);
    box-shadow: -24px 0 60px rgba(0, 0, 0, 0.45);
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

.reader-enter-active,
.reader-leave-active {
    transition: background 0.24s ease;
}

.reader-enter-active .inspector,
.reader-leave-active .inspector {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reader-enter-active .page,
.reader-leave-active .page {
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reader-enter-from,
.reader-leave-to {
    background: transparent;
}

.reader-enter-from .inspector,
.reader-leave-to .inspector {
    transform: translateX(100%);
}

.reader-enter-from .page,
.reader-leave-to .page {
    transform: translateX(100%);
}

.reader-leave-active :deep(.document-body),
.reader-leave-active :deep(.document-aside) {
    animation: none;
    transition:
        transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 0.22s ease-in;
}

.reader-leave-to :deep(.document-body) {
    opacity: 0;
    transform: translateX(-28px);
}

.reader-leave-to :deep(.document-aside) {
    opacity: 0;
    transform: translateX(28px);
}
</style>
