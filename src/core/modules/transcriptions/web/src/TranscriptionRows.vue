<script setup>
import {computed, ref} from "vue";
import {Btn, FilterBar, ListReaderLayout, PageHeader, Skeleton, applyFilter, copying, defaultFilter, useWindow} from "@journal/window-kit";
import TranscriptionReader from "./TranscriptionReader.vue";

const LIST_WIDTH = 400;
const view = useWindow();
const {rows, failure, loaded, act, actionFailure} = view.props.transcriptions;
const sources = view.props.sources;
const chosen = ref(null);
const notice = ref("");
const filter = ref(defaultFilter([]));
const words = ref("");

const dayOf = (at) => {
    const day = new Date(at).toDateString();
    if (day === new Date().toDateString()) return "Today";
    return day === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" : new Date(at).toLocaleDateString();
};
const listed = computed(() => rows.value.map((row) => ({id: row.id, title: row.title, desc: row.text.trim().slice(0, 140), group: dayOf(row.created_at), row})));
const shown = computed(() => applyFilter(listed.value, [], filter.value, words.value, ["title", "desc"]));

const save = (item, text) => act(["transcription", "edit", String(item.id), "--text", text]);

async function fetchFrom(server) {
    const result = await act(["transcription", "fetch", server.name]);
    if (result.ok) notice.value = `The agent was asked to fetch transcriptions from ${server.title}.`;
}

// a transcription is only read and edited: its menu has Open and two copies, never Duplicate or Delete
const place = (item) => ({
    head: item.title,
    items: [
        {label: "Open", group: "open", disabled: item.id === chosen.value, reason: "Already open", run: () => (chosen.value = item.id)},
        {label: "Copy number", group: "copy", run: ({say}) => copying(String(item.id), String(item.id), say)},
        {label: "Copy text", group: "copy", run: ({say}) => copying(item.row.text, "text", say)},
    ],
});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="shown" :list-width="LIST_WIDTH" :place="place" empty-title="No transcriptions yet" pick-line="No transcription chosen" data-transcriptions>
        <template #top>
            <PageHeader title="Transcriptions" :count="rows.length">
                <template #actions>
                    <template v-for="server in sources.rows.value" :key="server.name">
                        <Btn small :data-transcription-fetch="server.name" @click="fetchFrom(server)">Fetch transcriptions from {{ server.title }}</Btn>
                    </template>
                </template>
            </PageHeader>
            <FilterBar v-model="filter" v-model:words="words" :fields="[]" :rows="listed" :shown="shown.length" placeholder="Search transcriptions" />
            <template v-if="notice">
              <p class="note" data-transcription-notice>{{ notice }}</p>
            </template>
            <template v-if="actionFailure">
              <p class="note failed" role="alert">{{ actionFailure }}</p>
            </template>
            <template v-if="failure">
              <p class="note failed" role="alert">{{ failure }}</p>
            </template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>Transcripts of recordings appear here.</template>
        </template>
        <template #reader="{item}">
            <TranscriptionReader :key="item.id" :row="item.row" @save="(text) => save(item, text)" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.note {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--text-3);
    font-size: 12px;
}

.failed {
    color: var(--danger);
}
</style>
