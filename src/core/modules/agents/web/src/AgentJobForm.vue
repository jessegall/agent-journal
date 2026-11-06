<script setup>
import {Btn, TextArea} from "@journal/window-kit";

defineProps({row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean});
defineEmits(["submit", "cancel", "more", "update:task", "update:text"]);
</script>

<template>
    <form @submit.prevent="$emit('submit')">
        <template v-if="row.job_task_flag">
            <label class="action-field">Task
                <select :value="task" :disabled="pending || loading" data-agent-job-task @change="$emit('update:task', $event.target.value)">
                    <option value="">Choose an open task</option>
                    <template v-for="item in tasks" :key="item.id"><option :value="String(item.id)">{{ item.id }}: {{ item.title }}</option></template>
                </select>
            </label>
            <template v-if="moreTasks"><Btn small :disabled="pending || loading" data-agent-more-tasks @click="$emit('more')">More tasks</Btn></template>
            <template v-if="!loading && !tasks.length && !failure"><p>No open tasks.</p></template>
        </template>
        <template v-else><label class="action-field">Job<TextArea :value="text" :disabled="pending" data-agent-job-text @input="$emit('update:text', $event.target.value)" /></label></template>
        <div class="action-buttons"><Btn type="submit" small :disabled="pending || !jobReady" data-agent-submit-job>Send the job</Btn><Btn small :disabled="pending" @click="$emit('cancel')">Cancel</Btn></div>
    </form>
</template>

<style scoped src="./agentActionForms.css"></style>
