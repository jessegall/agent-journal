<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route, unpeek} from "../route.js";
import {meta, rows} from "../store.js";
import ResourceBody from "./ResourceBody.vue";
import DocumentPage from "./DocumentPage.vue";
import PlanPage from "./PlanPage.vue";

const props = defineProps({type: String, n: Number});
const resource = computed(() => (props.type ? rows(props.type).find((r) => r.n === props.n) : null) || null);
const shape = computed(() => (!props.type ? "" : props.type === "plan" ? "plan" : meta(props.type).view));
const close = () => (route.value.open ? unpeek() : go(route.value.env, props.type));
</script>

<template>
    <Transition name="reader">
        <div v-if="resource" :key="`${type}:${n}`" :class="['reader', shape]" @click.self="close">
            <SwitchCase :value="shape">
                <template #plan>
                    <div class="page"><PlanPage :resource="resource" @close="close" /></div>
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
</template>

<style scoped>
.reader {
    position: fixed;
    inset: 0;
    z-index: 20;
}
.reader.small,
.reader.wide {
    background: rgba(0, 0, 0, 0.35);
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
.page {
    position: absolute;
    inset: 0;
    overflow: auto;
    background: var(--bg);
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
    transition:
        opacity 0.2s ease,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
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
    opacity: 0;
    transform: translateY(8px);
}
</style>
