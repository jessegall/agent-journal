<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {peekRef} from "../route.js";

// what came in while the page was out of sight for five minutes or more, as version 4's card told it: the notices since, each opening its row
const AWAY_MILLISECONDS = 5 * 60 * 1000;
const props = defineProps({run: {type: Function, required: true}});
const notices = ref([]);
let hiddenAt = 0;

async function heardVisibility() {
    if (document.hidden) {
        hiddenAt = Date.now();
        return;
    }
    if (!hiddenAt || Date.now() - hiddenAt < AWAY_MILLISECONDS) return;
    const since = hiddenAt;
    const answer = await props.run(["notice", "list"]);
    notices.value = answer.ok ? answer.value.rows.filter((row) => new Date(row.created_at).getTime() >= since) : [];
}

function open(notice) {
    notices.value = notices.value.filter((row) => row.id !== notice.id);
    peekRef(`notices:${notice.id}`);
}

onMounted(() => document.addEventListener("visibilitychange", heardVisibility));
onUnmounted(() => document.removeEventListener("visibilitychange", heardVisibility));
</script>

<template>
    <template v-if="notices.length">
        <div class="away-card" role="status" data-away-card>
            <div class="away-head">
                <span class="away-title">While you were away: {{ notices.length }} {{ notices.length === 1 ? "notification" : "notifications" }}</span>
                <Btn small data-away-close @click="notices = []">Close</Btn>
            </div>
            <template v-for="notice in notices" :key="notice.id">
                <button type="button" class="away-line" data-away-line @click="open(notice)">{{ notice.title }}</button>
            </template>
        </div>
    </template>
</template>

<style scoped>
.away-card {
    position: fixed;
    z-index: 30;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: min(340px, calc(100vw - 32px));
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.away-head {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
}

.away-title {
    font-size: 13px;
    font-weight: 600;
}

.away-line {
    padding: 2px 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}
</style>
