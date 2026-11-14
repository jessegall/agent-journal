<script setup>
import {onMounted, ref} from "vue";
import {ReaderTimeline, useWindow} from "@journal/window-kit";

// the revisions of a document, newest first, as the reader's timeline: who made each, when, and what changed
const props = defineProps({id: {type: Number, required: true}});
const view = useWindow();
const entries = ref([]);
const failure = ref("");
onMounted(async () => {
    const answer = await view.read(["doc", "revisions", String(props.id)]);
    failure.value = answer.ok ? "" : answer.error;
    entries.value = answer.ok ? answer.value.rows.map((row) => ({id: row.number, by: row.author_name, at: row.created_at, text: `Revision ${row.number}: ${row.change}`})) : [];
});
</script>

<template>
    <div class="revisions" data-document-revisions-tab>
        <template v-if="failure"><p class="failure" role="alert">{{ failure }}</p></template>
        <ReaderTimeline :entries="entries" />
    </div>
</template>

<style scoped>
.revisions {
    padding-top: 16px;
}

.failure {
    color: var(--bad, var(--text-2));
    font-size: 12.5px;
}
</style>
