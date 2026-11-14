<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";
import Btn from "../kit/Btn.vue";
import {peekRef} from "../route.js";

// what came in while the page was out of sight for five minutes or more, as version 4's card told it: the pins since, each opening its row
const AWAY_MILLISECONDS = 5 * 60 * 1000;
const view = useWindow();
const pins = ref([]);
let hiddenAt = 0;

async function heardVisibility() {
    if (document.hidden) {
        hiddenAt = Date.now();
        return;
    }
    if (!hiddenAt || Date.now() - hiddenAt < AWAY_MILLISECONDS) return;
    const since = hiddenAt;
    await view.reload("pins");
    pins.value = view.props.pins.failure.value ? [] : (view.props.pins.data.value?.rows ?? []).filter((row) => new Date(row.created_at).getTime() >= since);
}

function open(pin) {
    pins.value = pins.value.filter((row) => row.id !== pin.id);
    peekRef(`pins:${pin.id}`);
}

onMounted(() => document.addEventListener("visibilitychange", heardVisibility));
onUnmounted(() => document.removeEventListener("visibilitychange", heardVisibility));
</script>

<template>
    <template v-if="pins.length">
        <div class="away-card" role="status" data-away-card>
            <div class="away-head">
                <span class="away-title">While you were away: {{ pins.length }} {{ pins.length === 1 ? "notification" : "notifications" }}</span>
                <Btn small data-away-close @click="pins = []">Close</Btn>
            </div>
            <template v-for="pin in pins" :key="pin.id">
                <button type="button" class="away-line" data-away-line @click="open(pin)">{{ pin.title }}</button>
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
