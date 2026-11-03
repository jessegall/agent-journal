<script setup>
import {computed, onMounted, ref} from "vue";
import {useResourceEvents} from "./resourceEvents.js";
import BackButton from "../kit/BackButton.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";
import ProcessQueueControls from "./ProcessQueueControls.vue";
import ProcessQueueRun from "./ProcessQueueRun.vue";

const props = defineProps({read: {type: Function, required: true}, backed: Boolean});
const emit = defineEmits(["close", "back"]);
const queue = ref(null);
const failure = ref("");
let reading = 0;
const sections = computed(() => [
    {kind: "running", heading: "Running", rows: queue.value.running, empty: "No command runs."},
    {kind: "waiting", heading: "Waiting", rows: queue.value.waiting, empty: "No command waits."},
    {kind: "recent", heading: "Finished lately", rows: queue.value.recent, empty: "Nothing finished yet."},
]);

async function load() {
    const turn = ++reading;
    const answer = await props.read(["queue", "list"]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) queue.value = answer.value;
}
useResourceEvents(["process.*", "setting.*"], load);
onMounted(load);
</script>

<template>
    <article class="process-queue" data-test-queue>
        <header class="top">
            <template v-if="backed"><BackButton @back="emit('back')" /></template>
            <span class="kind">
                <Icon name="terminal" :size="14" />
                Process queue
            </span>
            <CloseButton title="Close the process queue" data-resource-close @click="emit('close')" />
        </header>
        <div class="scroll">
            <template v-if="failure">
                <p class="failure" role="alert" data-resource-failure>{{ failure }}</p>
            </template>
            <template v-if="queue">
                <ProcessQueueControls :queue="queue" :read="read" @saved="load" />
                <template v-for="section in sections" :key="section.kind">
                    <section class="section" :aria-label="section.heading">
                        <h2 :data-queue-heading="section.kind">
                            {{ section.heading }}
                            <span>{{ section.rows.length }}</span>
                        </h2>
                        <template v-for="(run, index) in section.rows" :key="run.id">
                            <ProcessQueueRun :run="run" :position="index + 1" :read="read" />
                        </template>
                        <template v-if="!section.rows.length">
                            <p class="note" :data-queue-empty="section.kind">{{ section.empty }}</p>
                        </template>
                    </section>
                </template>
            </template>
            <template v-else-if="!failure"><Skeleton /></template>
        </div>
    </article>
</template>

<style scoped>
.process-queue {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}
.top {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 20px 18px 28px;
    border-bottom: 1px solid var(--border);
}
.kind {
    display: inline-flex;
    flex: 1;
    align-items: center;
    gap: 8px;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 500;
}
.scroll {
    flex: 1;
    overflow: auto;
    padding: 24px 28px 32px;
    scrollbar-width: thin;
}
.section {
    margin-top: 28px;
}
h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
}
h2 span {
    color: var(--text-4);
    font-size: 11px;
    font-weight: 400;
}
.note {
    margin: 0;
    padding: 12px 0;
    color: var(--text-4);
    font-size: 12px;
}
.failure {
    color: var(--danger);
    font-size: 12px;
}
</style>
