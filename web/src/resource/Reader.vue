<script setup>
import {computed} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route} from "../route.js";
import {meta, rows} from "../store.js";
import ResourceBody from "./ResourceBody.vue";
import PlanPage from "./PlanPage.vue";

const props = defineProps({type: String, n: Number});
const resource = computed(() => rows(props.type).find((r) => r.n === props.n) || null);
const shape = computed(() => (props.type === "plan" ? "plan" : meta(props.type).view));
const close = () => go(route.value.env, props.type);
</script>

<template>
    <div v-if="resource" :class="['reader', shape]" @click.self="close">
        <SwitchCase :value="shape">
            <template #plan>
                <div class="page"><PlanPage :resource="resource" @close="close" /></div>
            </template>
            <template #document>
                <div class="page"><ResourceBody :resource="resource" @close="close" /></div>
            </template>
            <template #default>
                <aside class="inspector"><ResourceBody :resource="resource" @close="close" /></aside>
            </template>
        </SwitchCase>
    </div>
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
    padding: 36px 32px 80px;
}
</style>
