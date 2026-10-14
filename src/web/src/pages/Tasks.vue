<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api.js";
import {live} from "../live.js";

const tasks = ref([]);
const title = ref("");
const load = async () => (tasks.value = await api.tasks());
const groups = computed(() => ["started", "open", "done"].map((state) => ({state, rows: tasks.value.filter((t) => t.state === state).sort((a, b) => a.id - b.id)})));

async function create() {
    if (!title.value.trim()) return;
    await api.createTask(title.value.trim(), "");
    title.value = "";
    await load();
}

onMounted(load);
watch(() => live.version, load);
</script>

<template>
    <div class="page">
        <h1>Tasks</h1>
        <form class="add" @submit.prevent="create">
            <input v-model="title" class="field" placeholder="A new task for the agent" />
            <button class="btn primary" type="submit">File</button>
        </form>
        <template v-for="g in groups" :key="g.state">
            <h2>{{ g.state }}</h2>
            <div v-if="!g.rows.length" class="empty">none</div>
            <div v-for="t in g.rows" :key="t.id" class="row">
                <span class="num">{{ t.id }}</span>
                <span class="title">{{ t.title }}<span v-if="t.brief" class="meta"> · {{ t.brief }}</span><span v-if="t.outcome" class="meta"> · {{ t.outcome }}</span></span>
                <span class="meta">{{ t.created_by }}</span>
                <button v-if="t.state === 'open'" class="btn" type="button" @click="api.startTask(t.id).then(load)">Start</button>
                <button v-if="t.state === 'started'" class="btn" type="button" @click="api.finishTask(t.id, '').then(load)">Done</button>
            </div>
        </template>
    </div>
</template>
