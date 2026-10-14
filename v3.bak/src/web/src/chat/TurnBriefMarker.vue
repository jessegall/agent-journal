<script setup>
import {clock} from "../format/time.js";
import {briefOpen} from "../composables/briefBand.js";

defineProps({at: {type: Number, default: 0}});
</script>

<template>
    <p class="brief-marker">
        Brief from the main agent · {{ clock(at) }} ·
        <button type="button" class="brief-show" @click="briefOpen = true">Show it</button>
    </p>
</template>

<style scoped>
.brief-marker {
    align-self: flex-end;
    margin: 2px 0;
    color: var(--text-3);
    font-size: 11.5px;
}

.brief-show {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}
</style>
