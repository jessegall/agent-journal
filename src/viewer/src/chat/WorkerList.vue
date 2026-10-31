<script setup>
import {workerCounts, workersBySection} from "../domain/workers.js";
import {momentEntry, workerEntry} from "../domain/agentEntries.js";
import {computed, ref} from "vue";
import AgentDropdown from "./AgentDropdown.vue";
import TestTurns from "./TestTurns.vue";
import Segmented from "../kit/Segmented.vue";
import WorkerCommandKinds from "./WorkerCommandKinds.vue";

const props = defineProps({rows: {type: Array, default: () => []}, loading: Boolean, moments: {type: Array, default: () => []}, momentsLoading: Boolean});
const TABS = [
    {key: "workers", label: "Workers"},
    {key: "activity", label: "Recent activity"},
];
const tab = ref("workers");
const emit = defineEmits(["close"]);
const entries = computed(() => Object.values(workersBySection(props.rows)).flat().map(workerEntry));
const momentEntries = computed(() => props.moments.map(momentEntry));
const counts = computed(() => workerCounts(props.rows));
const countsLine = computed(() =>
    [counts.value.working && `${counts.value.working} working`, counts.value.idle && `${counts.value.idle} idle`]
        .filter(Boolean)
        .join(" · ")
);

const settingsOpen = ref(false);
</script>

<template>
    <AgentDropdown
        title="Workers"
        table="workers"
        :entries="settingsOpen ? [] : tab === 'workers' ? entries : momentEntries"
        :counts="tab === 'workers' ? countsLine : ''"
        :none="settingsOpen ? '' : tab === 'workers' ? 'No workers have been sent from here.' : 'No worker has done anything noteworthy yet.'"
        :loading="!settingsOpen && (tab === 'workers' ? loading : momentsLoading)"
        @close="emit('close')"
    >
        <template #actions>
            <button type="button" class="workers-settings" title="Settings for workers" :aria-pressed="settingsOpen" @click="settingsOpen = !settingsOpen">
                <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.3" /><path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6l1.4 1.4M11 11l1.4 1.4M3.6 12.4 5 11M11 5l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" /></svg>
            </button>
        </template>
        <Transition name="workers-slide">
            <template v-if="settingsOpen">
                <WorkerCommandKinds @back="settingsOpen = false" />
            </template>
            <template v-else>
                <div class="workers-views">
                    <div class="workers-tabs">
                        <Segmented :options="TABS" :value="tab" fill @pick="tab = $event" />
                    </div>
                    <template v-if="tab === 'workers'">
                        <TestTurns :workers="rows" />
                    </template>
                </div>
            </template>
        </Transition>
    </AgentDropdown>
</template>

<style scoped>
.workers-tabs {
    flex: none;
    padding: 8px 8px 0;
}

.workers-settings {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.workers-settings:hover,
.workers-settings[aria-pressed="true"] {
    background: var(--hover);
    color: var(--text);
}

.workers-settings svg {
    width: 14px;
    height: 14px;
}

.workers-slide-enter-active,
.workers-slide-leave-active {
    transition:
        transform 0.18s ease,
        opacity 0.18s ease;
}

.workers-slide-enter-from {
    transform: translateX(16px);
    opacity: 0;
}

.workers-slide-leave-to {
    transform: translateX(-16px);
    opacity: 0;
}
</style>
