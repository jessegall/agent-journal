<script setup>
import TimeAgo from "./TimeAgo.vue";

// the revisions of a row, newest first: who made each, when, and what it says; a row with none says so in one word
defineProps({entries: {type: Array, required: true}});
</script>

<template>
    <ol class="reader-timeline" data-reader-timeline>
        <template v-for="entry in entries" :key="entry.id">
            <li class="reader-timeline-entry">
                <span class="reader-timeline-who">{{ entry.by }}</span>
                <TimeAgo class="reader-timeline-at" :at="entry.at" />
                <span class="reader-timeline-text">{{ entry.text }}</span>
            </li>
        </template>
        <template v-if="!entries.length"><li class="reader-timeline-none">None</li></template>
    </ol>
</template>

<style scoped>
.reader-timeline {
    display: flex;
    flex-direction: column;
    gap: var(--s3);
    margin: 0;
    padding: 0;
    list-style: none;
}

.reader-timeline-entry {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 2px var(--s3);
    font-size: 12.5px;
}

.reader-timeline-who {
    color: var(--text);
}

.reader-timeline-at {
    color: var(--text-3);
    text-align: right;
}

.reader-timeline-text {
    grid-column: 1 / -1;
    color: var(--text-2);
}

.reader-timeline-none {
    color: var(--text-3);
}
</style>
