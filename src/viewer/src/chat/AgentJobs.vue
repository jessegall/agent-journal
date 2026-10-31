<script setup>
import {ref} from "vue";
import {api} from "../api/client.js";
import {nextRun, scheduleWords} from "../domain/cron.js";
import {clock} from "../format/time.js";

const props = defineProps({agent: {type: Number, required: true}, jobs: {type: Array, default: () => []}});

// the jobs the user has asked to stop, which stay listed until the agent has deleted them
const stopping = ref([]);
const failed = ref("");

async function stop(job) {
    failed.value = "";
    stopping.value = [...stopping.value, job.id];
    try {
        await api.stopJob(props.agent, job.id);
    } catch (error) {
        stopping.value = stopping.value.filter((id) => id !== job.id);
        failed.value = error.message;
    }
}

const firstLine = (prompt) => String(prompt || "").split("\n")[0];
const next = (job) => {
    const at = nextRun(job.cron);
    return at ? `next at ${clock(at.getTime() / 1000)}` : "not due again";
};
</script>

<template>
    <div class="agent-jobs">
        <div class="agent-jobs-head">Scheduled</div>
        <template v-if="!jobs.length">
            <p class="agent-jobs-none">The agent has scheduled nothing.</p>
        </template>
        <template v-for="job in jobs" :key="job.id">
            <div class="agent-job">
                <div class="agent-job-text">
                    <b>{{ firstLine(job.prompt) }}</b>
                    <span>{{ scheduleWords(job.cron) }}{{ job.recurring ? "" : ", once" }} · {{ next(job) }}</span>
                </div>
                <button type="button" class="agent-job-stop" :disabled="stopping.includes(job.id)" @click="stop(job)">
                    {{ stopping.includes(job.id) ? "Stopping" : "Stop" }}
                </button>
            </div>
        </template>
        <template v-if="failed">
            <p class="agent-jobs-none">{{ failed }}</p>
        </template>
    </div>
</template>

<style scoped>
.agent-jobs {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
}

.agent-jobs-head {
    color: var(--text-3);
    font-size: 11.5px;
}

.agent-jobs-none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.agent-job {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
}

.agent-job-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.agent-job-stop {
    flex: none;
    padding: 2px 8px;
    border: 1px solid var(--border-3);
    border-radius: 5px;
    background: none;
    color: var(--text-2);
    font-size: 11.5px;
    cursor: pointer;
}

.agent-job-stop:hover:not(:disabled) {
    background: var(--hover);
    color: var(--text);
}

.agent-job-stop:disabled {
    cursor: default;
    opacity: 0.6;
}

.agent-job-text b {
    overflow: hidden;
    color: var(--text);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-job-text span {
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
