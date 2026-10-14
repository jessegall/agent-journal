<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {api} from "../api.js";
import {live} from "../live.js";

const plans = ref([]);
const tasks = reactive({});
const title = ref("");
const adding = reactive({});

async function load() {
    plans.value = await api.plans();
    for (const plan of plans.value) tasks[plan.id] = await api.planTasks(plan.id);
}

async function create() {
    if (!title.value.trim()) return;
    await api.createPlan(title.value.trim(), "");
    title.value = "";
    await load();
}

async function add(plan) {
    const text = (adding[plan.id] || "").trim();
    if (!text) return;
    await api.addPlanTask(plan.id, text);
    adding[plan.id] = "";
    await load();
}

onMounted(load);
watch(() => live.version, load);
</script>

<template>
    <div class="page">
        <h1>Plans</h1>
        <form class="add" @submit.prevent="create">
            <input v-model="title" class="field" placeholder="A new plan" />
            <button class="btn primary" type="submit">Draft</button>
        </form>
        <div v-if="!plans.length" class="empty">No plans here. A plan is ordered tasks the agent follows one by one.</div>
        <template v-for="p in plans" :key="p.id">
            <h2>{{ p.id }} · {{ p.title }} <span :class="['pill', p.state]">{{ p.state }}</span></h2>
            <div v-for="t in tasks[p.id] || []" :key="t.id" class="row">
                <span class="num">{{ t.id }}</span>
                <span class="title">{{ t.title }}</span>
                <span :class="['pill', t.state]">{{ t.state }}</span>
            </div>
            <form class="add" @submit.prevent="add(p)">
                <input v-model="adding[p.id]" class="field" placeholder="Add a task to this plan" />
                <button class="btn" type="submit">Add</button>
            </form>
        </template>
    </div>
</template>
