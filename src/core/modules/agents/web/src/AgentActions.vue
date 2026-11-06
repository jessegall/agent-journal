<script setup>
import {computed, ref} from "vue";
import {Btn, SwitchCase, useWindow} from "@journal/window-kit";
import AgentJobForm from "./AgentJobForm.vue";
import AgentRetireForm from "./AgentRetireForm.vue";

const props = defineProps({row: {type: Object, required: true}});
const context = useWindow();
const mode = ref("");
const text = ref("");
const reason = ref("");
const task = ref("");
const tasks = ref([]);
const taskPage = ref(0);
const moreTasks = ref(false);
const loading = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const retired = computed(() => Boolean(props.row.retired_at) || props.row.state === "retired");
const idle = computed(() => !retired.value && Boolean(props.row.ended_at));
const canSendJob = computed(() => idle.value && props.row.job_command?.length && !props.row.resume_reason);
const jobReady = computed(() => canSendJob.value && !loading.value && (props.row.job_task_flag ? tasks.value.some((item) => String(item.id) === task.value) : Boolean(text.value.trim())));

function choose(value) {
    mode.value = value;
    text.value = "";
    reason.value = "";
    task.value = "";
    failure.value = "";
    notice.value = "";
}
async function openJob() {
    choose("job");
    if (!props.row.job_task_flag) return;
    tasks.value = [];
    taskPage.value = 0;
    moreTasks.value = false;
    await readTasks();
}
async function readTasks() {
    if (loading.value) return;
    loading.value = true;
    try {
        const answer = await context.read(`task list --state open --limit 100 --page ${taskPage.value + 1}`);
        failure.value = answer.ok ? "" : answer.error;
        if (answer.ok) {
            tasks.value = [...tasks.value, ...answer.value.rows];
            taskPage.value = answer.value.page;
            moreTasks.value = answer.value.page * answer.value.size < answer.value.total;
        }
    } finally {
        loading.value = false;
    }
}
async function run(command, success) {
    if (pending.value) return;
    pending.value = true;
    failure.value = "";
    try {
        const answer = await context.run(command);
        failure.value = answer.ok ? "" : answer.error;
        if (answer.ok) {
            choose("");
            notice.value = success;
        }
    } finally {
        pending.value = false;
    }
}
async function sendJob() {
    if (!jobReady.value) return;
    const job = props.row.job_task_flag ? [props.row.job_task_flag, task.value] : [text.value.trim()];
    await run([...props.row.job_command, String(props.row.id), ...job], "Job sent.");
}
async function retire() {
    if (!idle.value || mode.value !== "retire" || !reason.value.trim()) return;
    await run(["agent", "retire", String(props.row.id), "--reason", reason.value.trim()], "Agent retired permanently.");
}
</script>

<template>
    <template v-if="!retired">
        <div class="agent-actions" data-agent-actions @click.stop @keydown.stop>
            <div class="action-buttons">
                <template v-if="idle">
                    <template v-if="row.job_command?.length"><Btn small data-agent-send-job :disabled="pending || loading || !canSendJob" @click="openJob">Send a job</Btn></template>
                    <template v-if="row.role !== 'main'"><Btn small data-agent-retire :disabled="pending || loading" @click="choose('retire')">Retire</Btn></template>
                </template>
            </div>
            <SwitchCase :value="mode">
                <template #job>
                    <AgentJobForm v-model:task="task" v-model:text="text" :row="row" :tasks="tasks" :pending="pending" :loading="loading" :more-tasks="moreTasks" :failure="failure" :job-ready="jobReady" @submit="sendJob" @more="readTasks" @cancel="choose('')" />
                </template>
                <template #retire>
                    <AgentRetireForm v-model:reason="reason" :pending="pending" @submit="retire" @cancel="choose('')" />
                </template>
            </SwitchCase>
            <template v-if="failure"><p role="alert">{{ failure }}</p></template>
            <template v-if="notice"><p role="status">{{ notice }}</p></template>
        </div>
    </template>
</template>

<style scoped>
.agent-actions { display: flex; flex-direction: column; gap: 6px; margin: 5px 0 0 16px; font-size: 12px; }
.action-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
p { margin: 0; color: var(--text-2); }
[role="alert"] { color: var(--danger); }
</style>
