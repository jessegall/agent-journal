<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {api} from "../api.js";
import {live} from "../live.js";

const lists = reactive({facts: [], rules: [], reminders: []});
const texts = reactive({facts: "", rules: "", reminders: ""});
const labels = {facts: "Facts about this environment", rules: "Rules for the whole project", reminders: "Reminders here"};

async function load() {
    [lists.facts, lists.rules, lists.reminders] = await Promise.all([api.facts(), api.rules(), api.reminders()]);
}

async function add(kind) {
    const text = texts[kind].trim();
    if (!text) return;
    await api.create(kind, {text});
    texts[kind] = "";
    await load();
}

onMounted(load);
watch(() => live.version, load);
</script>

<template>
    <div class="page">
        <h1>Memory</h1>
        <template v-for="(label, kind) in labels" :key="kind">
            <h2>{{ label }}</h2>
            <div v-if="!lists[kind].length" class="empty">none</div>
            <div v-for="row in lists[kind]" :key="row.id" class="row">
                <span class="num">{{ row.id }}</span>
                <span class="title">{{ row.text }}<span v-if="row.reason" class="meta"> · {{ row.reason }}</span></span>
                <span class="meta">{{ row.created_by }}</span>
            </div>
            <form v-if="kind !== 'rules'" class="add" @submit.prevent="add(kind)">
                <input v-model="texts[kind]" class="field" :placeholder="'A new ' + kind.slice(0, -1)" />
                <button class="btn" type="submit">Add</button>
            </form>
            <form v-else class="add" @submit.prevent="add(kind)">
                <input v-model="texts[kind]" class="field" placeholder="Always ... or Never ..." />
                <button class="btn" type="submit">Rule</button>
            </form>
        </template>
    </div>
</template>
