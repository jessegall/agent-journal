<script setup>
import {onMounted, ref, watch} from "vue";
import {api} from "../api.js";
import {live} from "../live.js";

const PAGE = 100;
const entries = ref([]);
const older = ref(true);
const load = async () => {
    entries.value = await api.entries(PAGE);
    older.value = entries.value.length === PAGE;
};
const loadOlder = async () => {
    const page = await api.entries(PAGE, entries.value[entries.value.length - 1]?.id);
    entries.value = [...entries.value, ...page];
    older.value = page.length === PAGE;
};
const when = (at) => new Date(at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"});
const detail = (e) => {
    if (e.kind === "nudge") return e.data.line;
    if (e.data && e.data.tool_name) return `${e.data.tool_name} ${JSON.stringify(e.data.tool_input || {}).slice(0, 160)}`;
    if (e.data && e.data.prompt) return e.data.prompt.slice(0, 200);
    return "";
};

onMounted(load);
watch(() => live.version, load);
</script>

<template>
    <div class="page">
        <h1>Timeline</h1>
        <div v-if="!entries.length" class="empty">Nothing has happened here yet.</div>
        <div v-for="e in entries" :key="e.id" :class="['entry', e.kind]">
            <span class="when">{{ when(e.created_at) }}</span>
            <span class="kind">{{ e.kind }} <span class="meta">· {{ e.actor }}</span></span>
            <span class="detail">{{ detail(e) }}</span>
        </div>
        <button v-if="older && entries.length" class="btn" type="button" @click="loadOlder">Older</button>
    </div>
</template>
