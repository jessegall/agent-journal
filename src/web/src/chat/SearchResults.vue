<script setup>
import Console from "../kit/Console.vue";
import Dialog from "../kit/Dialog.vue";
import EmptyState from "../kit/EmptyState.vue";
import SectionHeading from "../kit/SectionHeading.vue";

defineProps({search: {type: Object, required: true}});
const emit = defineEmits(["close"]);
</script>

<template>
    <Dialog :title="search.label" tall @close="emit('close')">
        <SectionHeading>Results</SectionHeading>
        <template v-if="search.found">
            <Console><pre class="search-text">{{ search.found }}</pre></Console>
        </template>
        <template v-else>
            <EmptyState>The search returned nothing.</EmptyState>
        </template>
        <SectionHeading class="search-reads">Opened after the search</SectionHeading>
        <template v-if="search.reads?.length">
            <template v-for="(read, i) in search.reads" :key="i">
                <p class="search-read">{{ read.label }}</p>
                <Console><pre class="search-text">{{ read.text }}</pre></Console>
            </template>
        </template>
        <template v-else>
            <EmptyState>Nothing was opened after this search.</EmptyState>
        </template>
    </Dialog>
</template>

<style scoped>
.search-text {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
}

.search-reads {
    margin-top: 16px;
}

.search-read {
    margin: 10px 0 4px;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}
</style>
