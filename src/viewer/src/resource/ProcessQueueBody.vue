<script setup>
import {computed, onMounted, ref} from "vue";
import {useResourceEvents} from "./resourceEvents.js";
import Skeleton from "../kit/Skeleton.vue";
import ProcessQueueControls from "./ProcessQueueControls.vue";
import ProcessQueueRun from "./ProcessQueueRun.vue";
import ProcessQueueBand from "./ProcessQueueBand.vue";

const RECENT_PAGE = 20;

const props = defineProps({read: {type: Function, required: true}, agent: {type: Number, default: 0}});
const agentArguments = computed(() => (props.agent ? ["--agent", `row:${props.agent}`] : []));
const queue = ref(null);
const failure = ref("");
const open = ref([]);
const recentCount = ref(RECENT_PAGE);
const hasOlder = computed(() => (queue.value?.recent_total ?? 0) > (queue.value?.recent.length ?? 0));
let reading = 0;
const items = computed(() => {
    if (!queue.value) return [];
    const sections = [
        {type: "running", heading: "Running", icon: "start", rows: queue.value.running, empty: "Nothing is running."},
        {type: "waiting", heading: "Waiting", icon: "clock", rows: queue.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once."},
        {type: "recent", heading: "Finished", icon: "check", rows: queue.value.recent, empty: "Nothing has run yet."},
    ];
    return sections.flatMap((section) => [
        {key: `band:${section.type}`, section},
        ...(section.rows.length ? section.rows.map((run, index) => ({key: `run:${run.id}`, run, position: index + 1})) : [{key: `none:${section.type}`, section, empty: true}]),
    ]);
});
function toggle(id) {
    open.value = open.value.includes(id) ? open.value.filter((value) => value !== id) : [...open.value, id];
}
async function load() {
    const turn = ++reading;
    const answer = await props.read([...(recentCount.value === RECENT_PAGE ? ["queue", "list"] : ["queue", "list", "--recent", String(recentCount.value)]), ...agentArguments.value]);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) queue.value = answer.value;
}
function showOlder() {
    recentCount.value += RECENT_PAGE;
    load();
}
useResourceEvents(["process.*", "setting.*"], load);
onMounted(load);
</script>

<template>
    <article class="process-queue" data-test-queue>
        <template v-if="!agent"><p class="lead">Commands from workers wait here for a free place. Reading and editing never wait.</p></template>
        <div class="scroll">
            <template v-if="failure"><p class="failure" role="alert" data-resource-failure>{{ failure }}</p></template>
            <template v-if="queue">
                <template v-if="!agent"><ProcessQueueControls :queue="queue" :read="read" @saved="load" /></template>
                <TransitionGroup name="queue" tag="div" class="queue-list">
                    <template v-for="item in items" :key="item.key">
                        <template v-if="item.run"><ProcessQueueRun :run="item.run" :environment="queue.environment_name" :position="item.position" :read="read" :expanded="open.includes(item.run.id)" @toggle="toggle(item.run.id)" /></template>
                        <template v-else-if="item.empty"><p class="empty" :data-queue-empty="item.section.type">{{ item.section.empty }}</p></template>
                        <template v-else><ProcessQueueBand :icon="item.section.icon" :count="item.section.rows.length" :data-queue-heading="item.section.type">{{ item.section.heading }}</ProcessQueueBand></template>
                    </template>
                </TransitionGroup>
                <template v-if="hasOlder"><button type="button" class="older" data-queue-older @click="showOlder">Show older commands</button></template>
            </template>
            <template v-else-if="!failure"><Skeleton /></template>
        </div>
    </article>
</template>

<style scoped>
.process-queue { display: flex; flex: 1; flex-direction: column; min-height: 0; }
.top { display: flex; align-items: center; gap: 8px; height: 34px; flex: none; padding: 0 6px 0 14px; background: var(--side); border-bottom: 1px solid var(--border); color: var(--text-3); }
h1 { margin: 0; color: var(--text); font-size: 11.5px; font-weight: 600; letter-spacing: .03em; }
.environment { flex: 1; font-size: 11px; }
.lead { margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text-3); font-size: 12px; line-height: 1.5; }
.scroll { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
.queue-list { position: relative; border-top: 1px solid var(--border); }
.empty { margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--bg); color: var(--text-3); font-size: 12px; }
.failure { padding: 10px 14px; color: var(--danger); font-size: 12px; }
.older { display: block; width: 100%; padding: 10px 14px; border: 0; background: none; color: var(--text-2); font: inherit; font-size: 12px; cursor: pointer; }
.older:hover { color: var(--text); }
.queue-move { transition: transform 320ms cubic-bezier(.2,.9,.25,1); }
.queue-enter-active { transition: opacity 200ms ease-out; }
.queue-leave-active { position: absolute; left: 0; right: 0; transition: opacity 160ms ease-out; }
.queue-enter-from, .queue-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .queue-move, .queue-enter-active, .queue-leave-active { transition: none; } }
</style>
