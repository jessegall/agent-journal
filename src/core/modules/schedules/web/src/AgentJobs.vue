<script setup>
import {ref} from "vue";
import {Btn, RowList, WindowRoom, useWindow} from "@journal/window-kit";
import {nextRun, scheduleWords} from "./cron.js";

// the jobs this agent scheduled for itself; a stop asks the agent to delete the job, so it stays listed until the agent has
const window = useWindow();
window.state["jobs.agent"] = String(window.agent);
const {rows, failure, loaded} = window.props.jobs;
const refusal = ref("");
const firstLine = (prompt) => prompt.split("\n")[0];

function next(row) {
    const at = nextRun(row.cron);
    return at ? `next at ${at.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"})}` : "not due in the next 8 days";
}

function words(row) {
    const schedule = scheduleWords(row.cron);
    return row.is_recurring || schedule.startsWith("once") ? schedule : `${schedule}, once`;
}

async function stop(row) {
    const answer = await window.run(["scheduled-job", "stop", String(row.id)]);
    refusal.value = answer.ok ? "" : answer.error;
    if (answer.ok) window.reload("jobs");
}
</script>

<template>
    <WindowRoom padding="14px 16px">
        <div class="agent-jobs">
            <template v-if="refusal">
                <p class="agent-jobs-refusal" role="alert" data-job-refusal>{{ refusal }}</p>
            </template>
            <RowList :rows="rows" :failure="failure" :loaded="loaded" empty="No scheduled jobs" hint="Scheduled jobs appear here.">
                <template #default="{row}">
                    <div class="agent-job" :data-job="row.job_id">
                        <div class="agent-job-text">
                            <b>{{ firstLine(row.prompt) }}</b>
                            <span>{{ words(row) }} · {{ next(row) }}</span>
                        </div>
                        <Btn small :disabled="Boolean(row.stop_requested_at)" data-job-stop @click="stop(row)">{{ row.stop_requested_at ? "Stopping" : "Stop" }}</Btn>
                    </div>
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.agent-jobs {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.agent-jobs-refusal {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}

.agent-job {
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;
    min-width: 0;
    padding: 6px 0;
}

.agent-job-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.agent-job-text span {
    color: var(--text-3);
    font-size: 12px;
}
</style>
