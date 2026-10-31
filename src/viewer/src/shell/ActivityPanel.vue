<script setup>
import {clock} from "../format/time.js";

// the Activity panel on the right as version 4 drew it: what happened in the journal, newest first, each with who did it and when
defineProps({events: {type: Array, default: () => []}});
const words = (event) => event.event.replace(".", " ").replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase());
const when = (event) => clock(new Date(event.timestamp).getTime() / 1000);
</script>

<template>
    <aside class="activity" data-activity>
        <p class="heading">Activity</p>
        <template v-for="event in events" :key="event.id">
            <div class="entry">
                <span class="what">{{ words(event) }} <span class="number">{{ event.row_id }}</span></span>
                <span class="when">{{ when(event) }}</span>
            </div>
        </template>
    </aside>
</template>

<style scoped>
.activity {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 8px;
    width: 280px;
    padding: 14px 16px;
    overflow-y: auto;
    border-left: 1px solid var(--border);
    background: var(--side);
}

.heading {
    margin: 0 0 6px;
    font-weight: 500;
}

.entry {
    display: flex;
    flex-direction: column;
    font-size: 13px;
}

.number,
.when {
    color: var(--text-3);
    font-size: 12px;
}
</style>
