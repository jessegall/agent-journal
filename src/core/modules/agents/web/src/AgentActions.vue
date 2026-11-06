<script setup>
import {computed, ref} from "vue";
import {Btn, SwitchCase, TextArea, TextInput, useWindow} from "@journal/window-kit";

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
async function sendMessage() {
    if (retired.value || idle.value || !text.value.trim()) return;
    await run(["message", "send", text.value.trim(), "--target-agent", String(props.row.id)], "Message sent.");
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
                <template v-else><Btn small data-agent-send-message :disabled="pending" @click="choose('message')">Send a message</Btn></template>
            </div>
            <SwitchCase :value="mode">
                <template #job>
                    <form @submit.prevent="sendJob">
                        <template v-if="row.job_task_flag">
                            <label class="action-field">Task
                                <select v-model="task" :disabled="pending || loading" data-agent-job-task>
                                    <option value="">Choose an open task</option>
                                    <template v-for="item in tasks" :key="item.id"><option :value="String(item.id)">{{ item.id }}: {{ item.title }}</option></template>
                                </select>
                            </label>
                            <template v-if="moreTasks"><Btn small :disabled="pending || loading" data-agent-more-tasks @click="readTasks">More tasks</Btn></template>
                            <template v-if="!loading && !tasks.length && !failure"><p>No open tasks.</p></template>
                        </template>
                        <template v-else><label class="action-field">Job<TextArea :value="text" :disabled="pending" data-agent-job-text @input="text = $event.target.value" /></label></template>
                        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !jobReady" data-agent-submit-job>Send the job</Btn><Btn small :disabled="pending" @click="choose('')">Cancel</Btn></div>
                    </form>
                </template>
                <template #message>
                    <form @submit.prevent="sendMessage">
                        <label class="action-field">Message<TextArea :value="text" :disabled="pending" data-agent-message-text @input="text = $event.target.value" /></label>
                        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !text.trim()" data-agent-submit-message>Send the message</Btn><Btn small :disabled="pending" @click="choose('')">Cancel</Btn></div>
                    </form>
                </template>
                <template #retire>
                    <form data-agent-retire-confirm @submit.prevent="retire">
                        <p>Retirement is permanent. This agent cannot be resumed.</p>
                        <TextInput v-model="reason" label="Reason" :disabled="pending" data-agent-retire-reason />
                        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !reason.trim()" data-agent-confirm-retire>Retire permanently</Btn><Btn small :disabled="pending" @click="choose('')">Cancel</Btn></div>
                    </form>
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
form, .action-field { display: flex; flex-direction: column; gap: 6px; }
form { padding: 10px; border: 1px solid var(--border); border-radius: 7px; }
p { margin: 0; color: var(--text-2); }
[role="alert"] { color: var(--danger); }
select { padding: 6px 9px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; }
:deep(.text-area) { min-height: 84px; }
</style>
