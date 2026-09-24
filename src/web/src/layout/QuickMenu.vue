<script setup>
import QuickRow from "./QuickRow.vue";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import Compose from "../chat/Compose.vue";
import {api} from "../api/client.js";
import {sendMessage} from "../chat/outbox.js";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route, showFile} from "../route.js";
import {open} from "../domain/records.js";
import {showAway} from "../platform/visibility.js";
import {agent, autoOn, store} from "../state/store.js";
import {setAuto} from "../actions/work.js";
import {useNavigation} from "../composables/navigation.js";
import {activityShown, toggleActivity} from "../actions/panels.js";

const props = defineProps({opening: {type: String, default: "menu"}});
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
const wholeProject = ref(false);
const found = ref([]);
const FIND_AFTER = 120;
let finding = 0;
onMounted(() => (props.opening === "project" ? browseFiles("", true) : input.value && input.value.focus()));

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

const folder = ref("");
const parent = computed(() => folder.value.split("/").slice(0, -1).join("/"));
const matchingFiles = computed(() => {
    const needle = fileQuery.value.trim().toLowerCase();
    if (wholeProject.value && needle) return found.value;
    const up = folder.value && !needle ? [{path: parent.value, name: "..", folder: true}] : [];
    return [...up, ...files.value.filter((file) => !needle || file.name.toLowerCase().includes(needle))];
});
const selectedFile = computed(() => matchingFiles.value[fileIndex.value] || null);

function size(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function findFiles() {
    clearTimeout(finding);
    const needle = fileQuery.value.trim();
    if (!wholeProject.value || !needle) return;
    finding = setTimeout(async () => {
        const got = await api.findFiles(needle);
        if (fileQuery.value.trim() === needle && wholeProject.value) found.value = got;
    }, FIND_AFTER);
}

function switchScope() {
    wholeProject.value = !wholeProject.value;
    fileIndex.value = 0;
    findFiles();
}

async function browseFiles(into = "", whole = wholeProject.value) {
    wholeProject.value = whole;
    screen.value = "files";
    folder.value = typeof into === "string" ? into : "";
    fileQuery.value = "";
    fileIndex.value = 0;
    filesError.value = "";
    filesLoading.value = true;
    nextTick(() => fileInput.value && fileInput.value.focus());
    try {
        files.value = await api.projectFiles(folder.value);
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
    if (file.folder) return browseFiles(file.path);
    emit("close");
    showFile(route.value.env, file.path);
}

const fileCommand = {label: "Open project file", keys: "file files open", hk: "f", icon: "file", run: browseFiles, opens: true};

async function send(text, files) {
    emit("close");
    await sendMessage(route.value.env, {brief: text}, files);
}

defineExpose({spaceAgain: () => !q.value && write(""), findInProject: () => browseFiles("", true)});

const goTo = (page) => () => {
    emit("close");
    go(route.value.env, page);
};

async function switchAuto(on) {
    emit("close");
    await setAuto(on);
}

const {everywhere} = useNavigation();
const inHand = computed(() => open("work").find((w) => !w.data.parked) || null);

async function pauseOrResume(paused) {
    emit("close");
    await (paused ? api.resumeAgent(agent.value.title) : api.pauseAgent(agent.value.title));
}
const commands = computed(() => {
    const pages = everywhere.value.map((link) => ({page: link.page, label: link.title, icon: link.icon}));
    const rows = pages.map((p, n) => ({
        label: `Go to ${p.label}`,
        keys: p.label,
        hk: n < 9 ? String(n + 1) : "",
        icon: p.icon,
        run: goTo(p.page),
    }));
    rows.push({label: "Search", keys: "search find", icon: "search", run: goTo("search")});
    rows.push({
        label: "Find a file in the project",
        keys: "find file project open",
        hk: "p",
        icon: "search",
        run: () => browseFiles("", true),
        opens: true,
    });
    if (inHand.value) {
        rows.push({
            label: `Open the work in hand: ${inHand.value.title}`,
            keys: "work current doing",
            hk: "w",
            icon: "work",
            run: () => {
                emit("close");
                peek("work", inHand.value.n);
            },
        });
    }
    if (agent.value) {
        const paused = Boolean(agent.value.data.paused);
        rows.push({
            label: paused ? "Resume the agent" : "Pause the agent",
            keys: "pause resume stop agent interrupt",
            icon: paused ? "resume" : "pause",
            run: () => pauseOrResume(paused),
        });
    }
    rows.push({
        label: store.wide ? "Leave full screen" : "Full screen",
        keys: "full screen wide zen",
        icon: store.wide ? "narrow" : "wide",
        run: () => {
            emit("close");
            store.wide = !store.wide;
        },
    });
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
        label: activityShown() ? "Hide the activity column" : "Show the activity column",
        keys: "activity column",
        icon: "activity",
        run: () => {
            emit("close");
            toggleActivity();
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
watch(fileIndex, () => inView(".quick-row.on"));

function onInput(e) {
    q.value = e.target.value;
    i.value = 0;
}

function onFileInput(e) {
    fileQuery.value = e.target.value;
    fileIndex.value = 0;
    findFiles();
}

function onFileKey(e) {
    if (e.isComposing) return;
    if (e.key === "Tab") {
        e.preventDefault();
        switchScope();
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        fileIndex.value = Math.min(fileIndex.value + 1, matchingFiles.value.length - 1);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        fileIndex.value = Math.max(fileIndex.value - 1, 0);
    } else if (e.key === "ArrowRight" && selectedFile.value?.folder && e.target.selectionStart === fileQuery.value.length) {
        e.preventDefault();
        browseFiles(selectedFile.value.path);
    } else if ((e.key === "ArrowLeft" || e.key === "Backspace") && !fileQuery.value) {
        e.preventDefault();
        if (folder.value) browseFiles(parent.value);
        else if (e.key === "ArrowLeft") back();
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
                            <QuickRow :icon="r.icon" :label="r.label" :on="n === cursor" @click="r.run" @mouseenter="i = n">
                                <template v-if="r.hk">
                                    <span class="quick-cap">{{ r.hk }}</span>
                                </template>
                            </QuickRow>
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
                            :placeholder="
                                wholeProject ? 'Find a file in the project…' : folder ? `Open a file in ${folder}/…` : 'Open project file…'
                            "
                            aria-label="Open project file"
                            @input="onFileInput"
                            @keydown="onFileKey"
                        />
                        <button
                            type="button"
                            :class="['quick-scope', {on: wholeProject}]"
                            title="Tab switches between the whole project and this folder"
                            @click="switchScope"
                        >
                            {{ wholeProject ? "Whole project" : "This folder" }}
                        </button>
                        <button type="button" class="quick-key" @click="back">esc</button>
                    </div>
                    <div class="quick-files">
                        <template v-if="filesLoading">
                            <div class="quick-file-empty">Loading {{ folder || "the project" }}…</div>
                        </template>
                        <template v-else-if="filesError">
                            <div class="quick-file-empty">{{ filesError }}</div>
                        </template>
                        <template v-else-if="!matchingFiles.length">
                            <div class="quick-file-empty">Nothing here matches.</div>
                        </template>
                        <template v-else>
                            <template v-for="(file, n) in matchingFiles" :key="file.path">
                                <QuickRow
                                    :icon="file.folder ? 'folder' : 'file'"
                                    :label="file.name"
                                    :on="n === fileIndex"
                                    @click="openFile(file)"
                                    @mouseenter="fileIndex = n"
                                >
                                    <template v-if="!file.folder">
                                        <template v-if="wholeProject && fileQuery.trim()">
                                            <span class="quick-file-dir">{{ file.path.slice(0, -file.name.length - 1) }}</span>
                                        </template>
                                        <span class="quick-file-size">{{ size(file.size) }}</span>
                                    </template>
                                </QuickRow>
                            </template>
                        </template>
                    </div>
                    <div class="quick-foot">
                        <span>↑↓ move</span>
                        <span>↵ open</span>
                        <span>→ open folder</span>
                        <span>← up</span>
                        <span>⇥ {{ wholeProject ? "this folder" : "whole project" }}</span>
                        <span class="quick-foot-note">/{{ folder }}</span>
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
    flex: none;
    height: 330px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
}

.quick-files {
    flex: none;
    height: 330px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
}

.quick-file-size {
    flex: none;
    color: var(--text-4);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
}

.quick-file-dir {
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;
}

.quick-scope {
    flex: none;
    height: 20px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: transparent;
    color: var(--text-3);
    font: inherit;
    font-size: 10.5px;
    cursor: pointer;
}

.quick-scope.on {
    border-color: var(--accent);
    color: var(--accent-text);
}

.quick-file-empty {
    padding: 28px 12px;
    color: var(--text-3);
    text-align: center;
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
</style>
