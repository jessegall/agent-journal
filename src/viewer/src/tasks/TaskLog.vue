<script setup>
import {onBeforeUnmount, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Skeleton from "../kit/Skeleton.vue";
import {pageOf} from "../sync/paging.js";

const props = defineProps({
    id: {type: Number, required: true},
    read: {type: Function, required: true},
    changes: {type: Number, default: 0},
});
const entries = ref([]);
const page = ref(1);
const lastPage = ref(true);
const loading = ref(true);
const failure = ref("");
let reading = 0;

async function load(number = 1) {
    const turn = ++reading;
    page.value = number;
    loading.value = true;
    failure.value = "";
    const answer = await props.read([
        "task-log",
        "list",
        "--task",
        String(props.id),
        "--limit",
        String(pageOf("task_logs")),
        "--page",
        String(number),
    ]);
    if (turn !== reading) return;
    loading.value = false;
    failure.value = answer.ok ? "" : answer.error;
    if (!answer.ok) return;
    entries.value = answer.value.rows;
    lastPage.value = answer.value.is_last_page;
}

watch(
    () => [props.id, props.changes],
    () => {
        entries.value = [];
        load();
    },
    {immediate: true}
);
onBeforeUnmount(() => {
    reading += 1;
});
</script>

<template>
    <section class="task-log" aria-label="Task log">
        <template v-if="loading">
            <Skeleton />
        </template>
        <template v-else-if="failure">
            <p role="alert" class="failure" data-task-log-failure>{{ failure }}</p>
            <Btn bordered data-task-log-retry @click="load(page)">Try again</Btn>
        </template>
        <template v-else>
            <template v-if="!entries.length">
                <p class="empty" data-task-log-empty>No log entries yet.</p>
            </template>
            <ol class="entries">
                <template v-for="entry in entries" :key="entry.id">
                    <li :class="['entry', {important: entry.important}]" data-task-log :data-task-log-important="entry.important ? '' : null">
                        <time :datetime="entry.created_at">{{ new Date(entry.created_at).toLocaleString() }}</time>
                        <p>{{ entry.line }}</p>
                    </li>
                </template>
            </ol>
            <template v-if="page > 1 || !lastPage">
                <nav class="pages" aria-label="Log pages">
                    <Btn small bordered :disabled="page === 1" data-task-log-newer @click="load(page - 1)">Newer</Btn>
                    <span>Page {{ page }}</span>
                    <Btn small bordered :disabled="lastPage" data-task-log-older @click="load(page + 1)">Older</Btn>
                </nav>
            </template>
        </template>
    </section>
</template>

<style scoped>
.task-log {
    flex: 1;
    overflow: auto;
    padding: 18px 20px 28px;
    scrollbar-width: thin;
}
.entries {
    list-style: none;
    margin: 0;
    padding: 0;
}
.entry {
    padding: 0 0 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border);
}
time,
.empty,
.pages {
    color: var(--text-3);
    font-size: 12px;
}
.entry.important p {
    color: var(--danger);
}
.entry p {
    margin: 6px 0 0;
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.pages {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
.failure {
    color: var(--danger);
}
</style>
