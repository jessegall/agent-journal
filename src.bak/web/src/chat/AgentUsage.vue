<script setup>
import UsageMeter from "./UsageMeter.vue";
import {resetLabel, usedPercent as used} from "../format/usage.js";

defineProps({usage: Array});
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
