<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Icon, Skeleton, TextInput, useWindow} from "@journal/window-kit";

// the project's files as version 4's browser had them: a folder's entries or the files a search finds, and the file chosen beside them
const context = useWindow();
const folder = ref("");
const words = ref("");
const rows = ref(null);
const failure = ref("");
const chosen = ref(null);
const refusal = ref("");
const crumbs = computed(() => (folder.value ? folder.value.split("/") : []));
const crumbPath = (index) => crumbs.value.slice(0, index + 1).join("/");
const lines = computed(() => (chosen.value?.text ?? "").split("\n"));
let reading = 0;

async function load() {
    const turn = ++reading;
    const wanted = words.value.trim();
    const answer = await context.read(wanted ? `project-file find ${JSON.stringify(wanted)}` : `project-file list ${JSON.stringify(folder.value)}`);
    if (turn !== reading) return;
    failure.value = answer.ok ? "" : answer.error;
    rows.value = answer.ok ? answer.value.rows : [];
}

async function open(row) {
    if (row.folder) {
        words.value = "";
        folder.value = row.id;
        return;
    }
    const answer = await context.read(`project-file show ${JSON.stringify(row.id)}`);
    refusal.value = answer.ok ? "" : answer.error;
    chosen.value = answer.ok ? answer.value : null;
}

watch([folder, words], load, {immediate: true});
</script>

<template>
    <div class="files">
        <div class="files-bar">
            <TextInput v-model="words" icon="search" class="files-search" placeholder="Find a file in the project" data-files-search />
            <Btn small data-files-root :disabled="!folder" @click="folder = ''">Project</Btn>
            <template v-for="(crumb, index) in crumbs" :key="crumbPath(index)">
                <Btn small :data-files-crumb="crumbPath(index)" @click="folder = crumbPath(index)">{{ crumb }}</Btn>
            </template>
        </div>
        <div class="files-body">
            <div class="files-list" data-files-list>
                <template v-if="failure">
                    <p class="files-note" role="alert">{{ failure }}</p>
                </template>
                <template v-else-if="rows === null">
                    <Skeleton shape="rows" />
                </template>
                <template v-else-if="!rows.length">
                    <p class="files-note">{{ words ? "No file matches" : "This folder is empty" }}</p>
                </template>
                <template v-for="row in rows ?? []" :key="row.id">
                    <button type="button" :class="['files-row', {on: row.id === chosen?.path}]" :data-file="row.id" @click="open(row)">
                        <Icon :name="row.folder ? 'folder' : 'file'" :size="13" />
                        <span class="files-name">{{ words ? row.id : row.name }}</span>
                    </button>
                </template>
            </div>
            <div class="files-reader">
                <template v-if="refusal">
                    <p class="files-note" role="alert">{{ refusal }}</p>
                </template>
                <template v-else-if="chosen">
                    <h2 class="files-path">{{ chosen.path }}</h2>
                    <template v-if="chosen.cut">
                        <p class="files-note">Only the start of this file is shown.</p>
                    </template>
                    <pre class="files-text" data-file-text><template v-for="(line, index) in lines" :key="index"><span class="files-line"><span class="files-number">{{ index + 1 }}</span>{{ line }}
</span></template></pre>
                </template>
                <template v-else>
                    <p class="files-note">Choose a file to read it here.</p>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.files {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.files-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
}

.files-search {
    flex: 0 1 280px;
    min-width: 160px;
    margin-right: 6px;
}

.files-body {
    display: grid;
    flex: 1;
    grid-template-columns: minmax(220px, 1fr) 3fr;
    min-height: 0;
}

.files-list {
    overflow-y: auto;
    padding: 6px;
    border-right: 1px solid var(--border);
}

.files-row {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    padding: 4px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.files-row:hover,
.files-row.on {
    background: var(--hover);
}

.files-name {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.files-reader {
    overflow: auto;
    padding: 14px 18px;
}

.files-path {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
}

.files-text {
    margin: 0;
    font-family: var(--mono, monospace);
    font-size: 12.5px;
    line-height: 1.5;
}

.files-line {
    display: block;
    white-space: pre;
}

.files-number {
    display: inline-block;
    width: 44px;
    margin-right: 12px;
    color: var(--text-3);
    text-align: right;
    user-select: none;
}

.files-note {
    margin: 6px 8px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
