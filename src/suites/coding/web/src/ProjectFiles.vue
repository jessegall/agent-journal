<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Icon, SearchBar, Skeleton, useWindow} from "@journal/window-kit";

const view = useWindow();
view.state["entries.folder"] = "";
const folder = ref("");
const words = ref("");
const list = computed(() => view.props[words.value.trim() ? "matches" : "entries"]);
const rows = computed(() => list.value.loaded.value ? list.value.rows.value : null);
const failure = computed(() => list.value.failure.value);
const {data: chosen, failure: refusal} = view.props.file;
const targetLine = ref(0);
const crumbs = computed(() => (folder.value ? folder.value.split("/") : []));
const crumbPath = (index) => crumbs.value.slice(0, index + 1).join("/");
const lines = computed(() => (chosen.value?.text ?? "").split("\n"));
function load() {
    const wanted = words.value.trim();
    view.state["entries.folder"] = folder.value;
    view.state["matches.words"] = wanted;
    view.reload(wanted ? "matches" : "entries");
}

function scrolledTo(element, number) {
    if (element && number === targetLine.value) element.scrollIntoView?.({block: "center"});
}

function open(row, lineNumber = 0) {
    if (row.folder) {
        words.value = "";
        folder.value = row.id;
        return;
    }
    targetLine.value = lineNumber;
    view.state["file.path"] = row.id;
    view.reload("file");
}

watch([folder, words], load);

// an address can name a file to open, and the line to show first, as a plugin's dashboard does
const address = new URLSearchParams(globalThis.location.search);
if (address.get("file")) open({id: address.get("file"), folder: false}, Number(address.get("line")) || 0);
</script>

<template>
    <div class="files">
        <SearchBar v-model="words" class="files-bar" data-files-search>
            <Btn small data-files-root :disabled="!folder" @click="folder = ''">Project</Btn>
            <template v-for="(crumb, index) in crumbs" :key="crumbPath(index)">
                <Btn small :data-files-crumb="crumbPath(index)" @click="folder = crumbPath(index)">{{ crumb }}</Btn>
            </template>
        </SearchBar>
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
                    <pre class="files-text" data-file-text><template v-for="(line, index) in lines" :key="index"><span :ref="(element) => scrolledTo(element, index + 1)" :class="['files-line', {target: index + 1 === targetLine}]" :data-file-line="index + 1"><span class="files-number">{{ index + 1 }}</span>{{ line }}
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
    flex-wrap: wrap;
    gap: 4px;
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

.files-line.target {
    background: var(--hover);
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
