<script setup>
import {computed, ref} from "vue";
import {Btn, SwitchCase, useWindow} from "@journal/window-kit";
import AgentDriverForm from "./AgentDriverForm.vue";
import AgentJobForm from "./AgentJobForm.vue";
import AgentRetireForm from "./AgentRetireForm.vue";
import AgentSessionHistory from "./AgentSessionHistory.vue";

const props = defineProps({row: {type: Object, required: true}, held: {type: Boolean, default: false}});
const view = useWindow();
const mode = ref("");
const text = ref("");
const reason = ref("");
const program = ref("");
const model = ref("");
const task = ref("");
const tasks = ref([]);
const taskPage = ref(0);
const moreTasks = ref(false);
const loading = ref(false);
const pending = ref(false);
const failure = ref("");
const notice = ref("");
const sessions = ref([]);
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
        view.state["jobs.page"] = String(taskPage.value + 1);
        await view.reload("jobs");
        const jobs = view.props.jobs;
        failure.value = jobs.failure.value;
        if (!failure.value) {
            tasks.value = [...tasks.value, ...jobs.rows.value];
            taskPage.value = jobs.data.value.page;
            moreTasks.value = jobs.more.value;
        }
    } finally {
        loading.value = false;
    }
}
// a user lifts every reading hold on the agent: a run held for printing nothing, and the blocks of its reader requests
async function liftHold() {
    await run(["process", "lift-hold", String(props.row.number)], "Hold lifted.");
}

async function run(command, success) {
    if (pending.value) return;
    pending.value = true;
    failure.value = "";
    try {
        const answer = await view.run(command);
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
    await run([...props.row.job_command, String(props.row.number), ...job], "Job sent.");
}
async function openHistory() {
    if (pending.value) return;
    pending.value = true;
    try {
        const answer = await view.run(["agent", "sessions", String(props.row.number)]);
        choose(answer.ok ? "history" : "");
        failure.value = answer.ok ? "" : answer.error;
        sessions.value = answer.ok ? answer.value.rows : [];
    } finally {
        pending.value = false;
    }
}
function openDriver() {
    choose("driver");
    program.value = props.row.program || "";
    model.value = "";
}
async function changeDriver() {
    if (!idle.value || mode.value !== "driver" || !program.value.trim() || !model.value.trim()) return;
    await run(["agent", "driver", String(props.row.number), "--program", program.value.trim(), "--model", model.value.trim()], "Driver changed.");
}
async function retire() {
    if (!idle.value || mode.value !== "retire" || !reason.value.trim()) return;
    await run(["agent", "retire", String(props.row.number), "--reason", reason.value.trim()], "Agent retired permanently.");
}
</script>

<template>
    <div class="agent-actions" data-agent-actions @click.stop @keydown.stop>
            <div class="action-buttons">
                <Btn small data-agent-history :disabled="pending || loading" @click="openHistory">Session history</Btn>
                <template v-if="held"><Btn small data-agent-lift-hold :disabled="pending" @click="liftHold">Lift this hold</Btn></template>
                <template v-if="idle">
                    <template v-if="row.job_command?.length"><Btn small data-agent-send-job :disabled="pending || loading || !canSendJob" @click="openJob">Send a job</Btn></template>
                    <template v-if="row.role !== 'main'"><Btn small data-agent-driver :disabled="pending || loading" @click="openDriver">Change driver</Btn></template>
                    <template v-if="row.role !== 'main'"><Btn small data-agent-retire :disabled="pending || loading" @click="choose('retire')">Retire</Btn></template>
                </template>
            </div>
            <SwitchCase :value="mode">
                <template #job>
                    <AgentJobForm v-model:task="task" v-model:text="text" :row="row" :tasks="tasks" :pending="pending" :loading="loading" :more-tasks="moreTasks" :failure="failure" :job-ready="jobReady" @submit="sendJob" @more="readTasks" @cancel="choose('')" />
                </template>
                <template #driver>
                    <AgentDriverForm v-model:program="program" v-model:model="model" :pending="pending" @submit="changeDriver" @cancel="choose('')" />
                </template>
                <template #history>
                    <AgentSessionHistory :sessions="sessions" @close="choose('')" />
                </template>
                <template #retire>
                    <AgentRetireForm v-model:reason="reason" :pending="pending" @submit="retire" @cancel="choose('')" />
                </template>
            </SwitchCase>
            <template v-if="failure"><p role="alert">{{ failure }}</p></template>
            <template v-if="notice"><p role="status">{{ notice }}</p></template>
    </div>
</template>

<style scoped>
.agent-actions { display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.action-buttons { display: flex; gap: 6px; flex-wrap: wrap; }
p { margin: 0; color: var(--text-2); }
[role="alert"] { color: var(--danger); }
</style>
