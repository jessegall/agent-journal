<script setup>
import UsageMeter from "./UsageMeter.vue";
import {span} from "../format/time.js";

defineProps({usage: Array});
const used = (window) => Math.max(0, Math.min(100, Number(window.used ?? 100 - window.remaining)));

function resetLabel(window) {
    const seconds = window.resets - Date.now() / 1000;
    return seconds > 0 ? `resets in ${span(seconds)}` : "reset due";
}
</script>

<template>
    <p class="bar-current">Plan allowance used</p>
    <template v-for="window in usage" :key="window.key">
        <UsageMeter :label="window.label" :percent="used(window)" :note="resetLabel(window)" />
    </template>
    <template v-if="!usage.length">
        <p class="bar-none">No current plan window has been reported here.</p>
    </template>
</template>
