<script setup>
import {computed} from "vue";
import {EditorTabs, Skeleton, useWindow} from "@journal/window-kit";
import FileTreeNode from "./FileTreeNode.vue";
import FilesBar from "./FilesBar.vue";
import FilesPalette from "./FilesPalette.vue";
import {useFilesBrowser} from "./filesBrowser.js";

// the project's files as an editor shows them: the tree on the left, the bar with the path, back and forward and the search over the file, the one search palette.
// Folders are read when they are opened and a file when it is chosen, each through the window.
const view = useWindow();
view.state["entries.folder"] = "";
const browser = useFilesBrowser(view);
const {data: chosen, failure: refusal} = view.props.file;
const rootRows = computed(() => browser.rowsOf(""));
// one tab per open file, named by its file name; the full path is the tab's key
const tabs = computed(() => browser.tabs.value.map((path) => ({key: path, title: path.split("/").pop(), icon: "file", on: path === browser.current.value})));
const lines = computed(() => (chosen.value?.text ?? "").split("\n"));

function scrolledTo(element, number) {
    if (element && number === browser.line.value) element.scrollIntoView?.({block: "center"});
}

// an address can name a file to open, and the line to show first, as a plugin's dashboard does
const address = new URLSearchParams(globalThis.location.search);
if (address.get("file")) browser.open(address.get("file"), Number(address.get("line")) || 0);
</script>

<template>
    <div class="files" data-files @pointerdown.capture="browser.markUsed" @focusin="browser.markUsed">
        <FilesBar :browser="browser" />
        <div class="files-body">
            <nav class="files-tree" aria-label="Project files" data-files-list>
                <template v-if="browser.failureOf('')">
                    <p class="files-note" role="alert">{{ browser.failureOf("") }}</p>
                </template>
                <template v-else-if="rootRows === null">
                    <Skeleton shape="rows" />
                </template>
                <template v-else-if="!rootRows.length">
                    <p class="files-note">This project has no files</p>
                </template>
                <template v-for="row in rootRows ?? []" :key="row.id">
                    <FileTreeNode :row="row" :browser="browser" />
                </template>
            </nav>
            <div class="files-main">
                <template v-if="tabs.length">
                    <EditorTabs :tabs="tabs" data-files-tabs @pick="browser.open($event)" @close="browser.closeTab($event)" />
                </template>
                <div class="files-reader">
                <template v-if="refusal && browser.current.value">
                    <p class="files-note" role="alert">{{ refusal }}</p>
                </template>
                <template v-else-if="chosen && browser.current.value">
                    <template v-if="chosen.cut">
                        <p class="files-note">Only the start of this file is shown.</p>
                    </template>
                    <pre class="files-text" data-file-text><template v-for="(line, index) in lines" :key="index"><span :ref="(element) => scrolledTo(element, index + 1)" :class="['files-line', {target: index + 1 === browser.line.value}]" :data-file-line="index + 1"><span class="files-number">{{ index + 1 }}</span>{{ line }}
</span></template></pre>
                </template>
                <template v-else>
                    <p class="files-note">Choose a file to read it here.</p>
                </template>
                </div>
            </div>
        </div>
        <template v-if="browser.palette.value">
            <FilesPalette :browser="browser" />
        </template>
    </div>
</template>

<style scoped>
.files {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.files-body {
    display: flex;
    flex: 1;
    min-height: 0;
}

.files-tree {
    flex: none;
    width: 260px;
    padding: 6px 0;
    overflow: auto;
    border-right: 1px solid var(--border);
    background: var(--bg-2);
}

.files-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.files-reader {
    flex: 1;
    min-width: 0;
    padding: 14px 18px;
    overflow: auto;
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

@media (max-width: 1100px) {
    .files-tree {
        width: 220px;
    }
}
</style>
