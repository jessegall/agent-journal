<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {CommentBox, CommentRail, EditorTabs, Skeleton, useWindow} from "@journal/window-kit";
import FileTreeNode from "./FileTreeNode.vue";
import FilesBar from "./FilesBar.vue";
import FilesPalette from "./FilesPalette.vue";
import FileReader from "./FileReader.vue";
import FileStatusBar from "./FileStatusBar.vue";
import {languageOf} from "./codeTint.js";
import {rangeText} from "./fileComments.js";
import {tabItems} from "./fileMenus.js";
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
// the comments of the file shown: the box under the code, the thread under the last line of each, and the rail beside the code when the window is wide enough
const RAIL_FROM = 980;
const comments = browser.comments;
const box = ref(null);
// a comment asked for from a menu opens the box, once the file it is about is shown
watch(() => browser.commentAsked.value, async () => {
    await nextTick();
    await nextTick();
    box.value?.openBox();
});
const root = ref(null);
const width = ref(RAIL_FROM);
let watcher = null;
onMounted(() => {
    if (typeof ResizeObserver === "undefined" || !root.value) return;
    watcher = new ResizeObserver(() => (width.value = root.value.clientWidth));
    watcher.observe(root.value);
});
onUnmounted(() => watcher?.disconnect());
const railShown = computed(() => comments.available.value && comments.rows.value.length > 0 && comments.railOn.value);
const quote = computed(() => (browser.selection.value ? `${rangeText(browser.selection.value)} · ${browser.current.value.split("/").pop()}` : ""));
function showComment(id) {
    comments.hot.value = id;
    const comment = comments.rows.value.find((row) => row.id === id);
    if (comment?.from) browser.line.value = comment.from;
}
const lineCount = computed(() => (chosen.value?.text ?? "").split("\n").length);

// an address can name a file to open, and the line to show first, as a plugin's dashboard does
const address = new URLSearchParams(globalThis.location.search);
if (address.get("file")) browser.open(address.get("file"), Number(address.get("line")) || 0);
</script>

<template>
    <div ref="root" class="files" data-files @pointerdown.capture="browser.markUsed" @focusin="browser.markUsed">
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
                    <EditorTabs :tabs="tabs" :extra="(tab) => tabItems(browser, tab.key)" data-files-tabs @pick="browser.open($event)" @close="browser.closeTab($event)" />
                </template>
                <template v-if="refusal && browser.current.value">
                    <p class="files-note" role="alert">{{ refusal }}</p>
                </template>
                <template v-else-if="chosen && browser.current.value">
                    <div class="files-view">
                        <div class="files-column">
                            <FileReader :browser="browser" :path="browser.current.value" :file="chosen" :target="browser.line.value" :selection="browser.selection.value" :comments="comments.rows.value" :hot="comments.hot.value" @pick="browser.pick" @show="showComment" />
                            <template v-if="comments.available.value">
                                <CommentBox ref="box" :count="comments.rows.value.length" :quote="quote" :sending="comments.sending.value" @send="comments.send" @show="comments.railOn.value = true" @clear-quote="browser.selection.value = null" />
                            </template>
                            <FileStatusBar :path="browser.current.value" :git="chosen.git" :agent="browser.editor.value" :lines="lineCount" :language="languageOf(browser.current.value)" />
                        </div>
                        <template v-if="railShown">
                            <CommentRail :comments="comments.shown.value" :hot="comments.hot.value" :floating="width < RAIL_FROM" @show="showComment" @close="comments.railOn.value = false" />
                        </template>
                    </div>
                </template>
                <template v-else>
                    <p class="files-note">Choose a file to read it here.</p>
                </template>
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

.files-view {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;
}

.files-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.files-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
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
