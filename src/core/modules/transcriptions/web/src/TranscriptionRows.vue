<script setup>
import {computed, ref} from "vue";
import {Btn, ListTools, RowList, TimeAgo, WindowRoom, ResourceLinks, peekRef, useListTools, useWindow} from "@journal/window-kit";

const window = useWindow();
const {rows, failure, loaded, act, actionFailure} = window.props.transcriptions;
const sources = window.props.sources;
const tools = useListTools(rows, {title: (row) => `${row.title} ${row.text}`});
const drafting = ref(false);
const draft = ref({title: "", text: ""});
const opened = ref(null);
const openedText = ref("");
const notice = ref("");

const canMake = computed(() => draft.value.title.trim() && draft.value.text.trim());
const preview = (row) => row.text.trim().slice(0, 140);

async function make() {
    const result = await act(["transcription", "make", draft.value.title.trim(), "--text", draft.value.text]);
    if (!result.ok) return;
    draft.value = {title: "", text: ""};
    drafting.value = false;
}

function open(row) {
    opened.value = row;
    openedText.value = row.text;
}

const openLinked = (target) => peekRef(`${target.table}:${target.id}`);

function readLinks(line) {
    const flags = {};
    for (const name of ["page", "page-size", "kind"]) {
        const index = line.indexOf(`--${name}`);
        if (index >= 0) flags[name] = line[index + 1];
    }
    return window.readKey(`links.${opened.value.id}`, flags);
}

async function save() {
    const result = await act(["transcription", "edit", String(opened.value.id), "--text", openedText.value]);
    if (result.ok) opened.value = {...opened.value, text: openedText.value};
}

async function fetchFrom(server) {
    const result = await act(["transcription", "fetch", server.name]);
    if (result.ok) notice.value = `The agent was asked to fetch transcriptions from ${server.title}.`;
}
</script>

<template>
    <WindowRoom>
        <div class="transcriptions" data-transcriptions>
            <div class="bar">
                <Btn small data-transcription-new @click="drafting = !drafting">New transcription</Btn>
                <template v-for="server in sources.rows.value" :key="server.name">
                    <Btn small :data-transcription-fetch="server.name" @click="fetchFrom(server)">Fetch transcriptions from {{ server.title }}</Btn>
                </template>
                <template v-if="notice">
                    <span class="note" data-transcription-notice>{{ notice }}</span>
                </template>
            </div>
            <template v-if="actionFailure">
                <p class="failure">{{ actionFailure }}</p>
            </template>
            <template v-if="drafting">
                <form class="form" data-transcription-form @submit.prevent="make">
                    <input v-model="draft.title" placeholder="Title" aria-label="Title">
                    <textarea v-model="draft.text" rows="10" placeholder="Paste the transcript" aria-label="Transcript"></textarea>
                    <Btn small variant="primary" type="submit" :disabled="!canMake">Save</Btn>
                </form>
            </template>
            <ListTools :tools="tools" />
            <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No transcriptions yet" hint="Transcripts of recordings appear here." :searching="tools.filtering.value">
                <template #default="{row}">
                    <button type="button" class="row" :data-transcription="row.id" @click="open(row)">
                        <span class="title">{{ row.title }}</span>
                        <span class="note">{{ row.source || "pasted" }} · <TimeAgo :at="row.created_at" /></span>
                        <span class="note">{{ preview(row) }}</span>
                    </button>
                </template>
            </RowList>
            <template v-if="opened">
                <section class="opened" data-transcription-opened>
                    <h3 class="title">{{ opened.title }}</h3>
                    <textarea v-model="openedText" rows="14" aria-label="Transcript"></textarea>
                    <div class="bar">
                        <Btn small variant="primary" data-transcription-save :disabled="openedText === opened.text" @click="save">Save</Btn>
                        <Btn small @click="opened = null">Close</Btn>
                    </div>
                    <h3 class="note">Linked items</h3>
                    <ResourceLinks model="transcription" :id="opened.id" :read="readLinks" link-attribute="data-transcription-link" empty="Nothing yet" @open="openLinked" />
                </section>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.transcriptions,
.form,
.opened {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 400;
}

.failure {
    margin: 0;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 8px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.title {
    margin: 0;
    font-size: inherit;
    font-weight: 600;
}

input,
textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface, none);
    color: inherit;
    font: inherit;
}
</style>
