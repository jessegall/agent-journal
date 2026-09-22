<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import Compose from "../chat/Compose.vue";
import {api} from "../api/client.js";
import {sendMessage} from "../chat/outbox.js";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {unreadByUser} from "../domain/records.js";
import {showAway} from "../platform/visibility.js";
import {autoOn, meta, navTypes, store, types} from "../state/store.js";
import {setAuto} from "../actions/work.js";

const emit = defineEmits(["close"]);
const q = ref("");
const i = ref(0);
const input = ref(null);
const screen = ref("menu");
const fileInput = ref(null);
const fileQuery = ref("");
const fileIndex = ref(0);
const files = ref([]);
const filesLoading = ref(false);
const filesError = ref("");
onMounted(() => input.value && input.value.focus());

function focusArea(area, draft) {
    if (!area) return false;
    if (draft) {
        area.value = draft;
        area.dispatchEvent(new Event("input", {bubbles: true}));
    }
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
    return true;
}

function focusThread(draft) {
    if (route.value.page) return false;
    return focusArea(document.querySelector(".thread textarea"), draft);
}

function focusComposer(draft) {
    nextTick(() => focusArea(document.querySelector(".quick-write textarea"), draft));
}

function write(draft) {
    if (focusThread(draft)) {
        emit("close");
        return;
    }
    screen.value = "writing";
    focusComposer(draft);
}

function back() {
    screen.value = "menu";
    nextTick(() => input.value && input.value.focus());
}

const matchingFiles = computed(() => {
    const needle = fileQuery.value.trim().toLowerCase();
    return files.value.filter((file) => !needle || file.path.toLowerCase().includes(needle));
});
const selectedFile = computed(() => matchingFiles.value[fileIndex.value] || null);

function size(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

async function browseFiles() {
    screen.value = "files";
    fileQuery.value = "";
    fileIndex.value = 0;
    filesError.value = "";
    filesLoading.value = true;
    nextTick(() => fileInput.value && fileInput.value.focus());
    try {
        files.value = await api.projectFiles();
    } catch (e) {
        files.value = [];
        filesError.value = e.message;
    } finally {
        filesLoading.value = false;
        nextTick(() => fileInput.value && fileInput.value.focus());
    }
}

function openFile(file) {
    if (!file) return;
    emit("close");
    go(route.value.env, "file", 0, file.path);
}

const fileCommand = {label: "Open project file", keys: "file files open", hk: "f", icon: "file", run: browseFiles, opens: true};

async function send(text, files) {
    emit("close");
    await sendMessage(route.value.env, {brief: text}, files);
}

defineExpose({spaceAgain: () => !q.value && write("")});

const goTo = (page) => () => {
    emit("close");
    go(route.value.env, page);
};

async function switchAuto(on) {
    emit("close");
    await setAuto(on);
}

const highlights = computed(() => types.value.filter((t) => t.needs_attention).flatMap((t) => unreadByUser(t.name)));
const commands = computed(() => {
    const pages = [
        {page: "", label: "Home", icon: "home"},
        ...navTypes("environment").map((t) => ({page: t.name, label: `${meta(t.name).title}s`, icon: t.icon})),
    ];
    const rows = pages.map((p, n) => ({label: `Go to ${p.label}`, keys: p.label, hk: String(n + 1), icon: p.icon, run: goTo(p.page)}));
    rows.push({label: "Go to Settings", keys: "settings preferences", icon: "settings", run: goTo("settings")});
    rows.push({label: "Search", keys: "search find", icon: "search", run: goTo("search")});
    if (highlights.value.length) {
        const first = highlights.value[0];
        rows.unshift({
            label: `Open the first of ${highlights.value.length} highlights`,
            keys: "open highlights review",
            hk: "a",
            icon: "questions",
            run: () => {
                emit("close");
                peek(first.type, first.n);
            },
        });
    }
    rows.push({
        label: autoOn.value ? "Pause auto mode" : "Resume auto mode",
        keys: "auto mode",
        icon: "auto",
        run: () => switchAuto(!autoOn.value),
    });
    rows.push({
        label: "Show what happened while you were away",
        keys: "away digest recap",
        icon: "bell",
        run: () => {
            emit("close");
            showAway();
        },
    });
    rows.push({
        label: store.activity ? "Hide the activity column" : "Show the activity column",
        keys: "activity column",
        icon: "activity",
        run: () => {
            emit("close");
            store.activity = !store.activity;
        },
    });
    return rows;
});

const rows = computed(() => {
    const needle = q.value.trim().toLowerCase();
    const found = commands.value.filter((c) => !needle || `${c.label} ${c.keys}`.toLowerCase().includes(needle));
    if (!needle) return [{label: "Message the agent", hk: "space", icon: "arrow", run: () => write("")}, fileCommand, ...found];
    return [...found, {label: `Message the agent: “${q.value.trim()}”`, icon: "arrow", run: () => write(q.value.trim())}];
});
const cursor = computed(() => Math.max(0, Math.min(i.value, rows.value.length - 1)));

function onKey(e) {
    if (e.isComposing) return;
    const hot =
        !q.value && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && rows.value.find((r) => r.hk === e.key.toLowerCase());
    if (e.key === " " && !q.value) {
        e.preventDefault();
        e.stopPropagation();
        write("");
    } else if (hot) {
        e.preventDefault();
        e.stopPropagation();
        hot.run();
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        i.value = Math.min(cursor.value + 1, rows.value.length - 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        i.value = Math.max(cursor.value - 1, 0);
    } else if (e.key === "ArrowRight" && rows.value[cursor.value] && rows.value[cursor.value].opens) {
        e.preventDefault();
        rows.value[cursor.value].run();
    } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (rows.value[cursor.value]) rows.value[cursor.value].run();
    } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        emit("close");
    }
}

function inView(selector) {
    nextTick(() => {
        const on = document.querySelector(selector);
        if (on) on.scrollIntoView({block: "nearest"});
    });
}
watch(cursor, () => inView(".quick-row.on"));
watch(fileIndex, () => inView(".quick-file.on"));

function onInput(e) {
    q.value = e.target.value;
    i.value = 0;
}

function onFileInput(e) {
    fileQuery.value = e.target.value;
    fileIndex.value = 0;
}

function onFileKey(e) {
    if (e.isComposing) return;
    if (e.key === "ArrowDown") {
        e.preventDefault();
        fileIndex.value = Math.min(fileIndex.value + 1, matchingFiles.value.length - 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        fileIndex.value = Math.max(fileIndex.value - 1, 0);
    } else if (e.key === "ArrowLeft" && !fileQuery.value) {
        e.preventDefault();
        back();
    } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        openFile(selectedFile.value);
    } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        back();
    }
}
</script>

<template>
    <div class="quick-shell">
        <div class="quick-scrim" @click="emit('close')" />
        <div class="quick-menu" role="dialog" aria-label="Quick menu">
            <SwitchCase :value="screen">
                <template #menu>
                    <div class="quick-head">
                        <Icon name="search" />
                        <input
                            ref="input"
                            class="quick-input"
                            :value="q"
                            placeholder="Search actions…"
                            aria-label="Search actions"
                            @input="onInput"
                            @keydown="onKey"
                        />
                        <button type="button" class="quick-key" @click="emit('close')">esc</button>
                    </div>
                    <div class="quick-rows">
                        <template v-for="(r, n) in rows" :key="r.label">
                            <button type="button" :class="['quick-row', {on: n === cursor}]" @click="r.run" @mouseenter="i = n">
                                <Icon :name="r.icon" />
                                <span class="quick-label">{{ r.label }}</span>
                                <template v-if="r.hk">
                                    <span class="quick-cap">{{ r.hk }}</span>
                                </template>
                            </button>
                        </template>
                    </div>
                    <div class="quick-foot">
                        <span>↑↓ move</span>
                        <span>↵ run</span>
                        <span class="quick-foot-note">
                            {{ q.trim() ? `${rows.length} ${rows.length === 1 ? "match" : "matches"}` : "press a key, or search" }}
                        </span>
                    </div>
                </template>
                <template #files>
                    <div class="quick-head browsing">
                        <Icon name="file" />
                        <input
                            ref="fileInput"
                            class="quick-input"
                            :value="fileQuery"
                            placeholder="Open project file…"
                            aria-label="Open project file"
                            @input="onFileInput"
                            @keydown="onFileKey"
                        />
                        <button type="button" class="quick-key" @click="back">esc</button>
                    </div>
                    <div class="quick-files">
                        <template v-if="filesLoading">
                            <div class="quick-file-empty">Loading project files…</div>
                        </template>
                        <template v-else-if="filesError">
                            <div class="quick-file-empty">{{ filesError }}</div>
                        </template>
                        <template v-else-if="!matchingFiles.length">
                            <div class="quick-file-empty">No project files match.</div>
                        </template>
                        <template v-else>
                            <template v-for="(file, n) in matchingFiles" :key="file.path">
                                <button
                                    type="button"
                                    :class="['quick-file', {on: n === fileIndex}]"
                                    @click="openFile(file)"
                                    @mouseenter="fileIndex = n"
                                >
                                    <Icon name="file" />
                                    <span class="quick-file-path">{{ file.path }}</span>
                                    <span class="quick-file-size">{{ size(file.size) }}</span>
                                </button>
                            </template>
                        </template>
                    </div>
                    <div class="quick-foot">
                        <span>↑↓ move</span>
                        <span>↵ open</span>
                        <span class="quick-foot-note">{{ matchingFiles.length }} {{ matchingFiles.length === 1 ? "file" : "files" }}</span>
                    </div>
                </template>
                <template #default>
                    <div class="quick-head writing">
                        <Icon name="arrow" />
                        <span class="quick-write-title">Message the agent</span>
                        <button type="button" class="quick-key" @click="back">esc</button>
                    </div>
                    <div class="quick-write" @keydown.esc.prevent.stop="back">
                        <Compose :send="send" placeholder="Ask it something, or tell it what to do next…" />
                    </div>
                </template>
            </SwitchCase>
        </div>
    </div>
</template>

<style scoped>
.quick-scrim {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(4, 5, 6, 0.62);
}

.quick-menu {
    position: fixed;
    z-index: 51;
    top: 92px;
    left: 50%;
    transform: translateX(-50%);
    width: min(580px, calc(100% - 56px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #33363d;
    border-radius: 14px;
    background: #151619;
    box-shadow: 0 26px 64px rgba(0, 0, 0, 0.6);
}

.quick-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 11px;
    height: 54px;
    padding: 0 15px;
    border-bottom: 1px solid var(--border);
}

.quick-head.writing {
    color: var(--text);
}

.quick-write-title {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
}

.quick-write {
    padding: 14px 15px 15px;
}

.quick-write :deep(.compose-box) {
    border-color: var(--border-2);
}

.quick-head .ico {
    flex: none;
    width: 15px;
    height: 15px;
    color: var(--text-3);
}

.quick-input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    outline: none;
}

.quick-key {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    background: transparent;
    color: var(--text-3);
    font: inherit;
    font-size: 10.5px;
    cursor: pointer;
}

.quick-rows {
    flex: 1;
    min-height: 0;
    max-height: 294px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
}

.quick-files {
    flex: 1;
    min-height: 0;
    max-height: 360px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
}

.quick-file {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 36px;
    padding: 0 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.quick-file.on {
    background: var(--sel);
    color: var(--text);
}

.quick-file .ico {
    flex: none;
    width: 14px;
    height: 14px;
    color: var(--text-3);
}

.quick-file.on .ico {
    color: var(--accent-text);
}

.quick-file-path {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.quick-file-size {
    flex: none;
    color: var(--text-4);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
}

.quick-file-empty {
    padding: 28px 12px;
    color: var(--text-3);
    text-align: center;
}

.quick-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 38px;
    padding: 0 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.quick-row.on {
    background: var(--sel);
    color: var(--text);
}

.quick-row .ico {
    flex: none;
    width: 14px;
    height: 14px;
    color: var(--text-3);
}

.quick-row.on .ico {
    color: var(--accent-text);
}

.quick-label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.quick-cap {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    color: var(--text-3);
    font-size: 10.5px;
    line-height: 1;
    white-space: nowrap;
}

.quick-row.on .quick-cap {
    border-color: #3a3d44;
    color: #c3c7fb;
}

.quick-foot {
    flex: none;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 9px 15px;
    border-top: 1px solid var(--border);
    background: var(--code-bg);
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
}

.quick-foot-note {
    margin-left: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.quick-row,
.quick-file {
    scroll-margin-block: 40px;
}
</style>
