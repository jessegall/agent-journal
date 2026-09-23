<script setup>
import ShellPicker from "./ShellPicker.vue";
import {framed} from "../platform/view.js";
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import AgentBar from "../chat/AgentBar.vue";
import Thread from "../chat/Thread.vue";
import {go, route} from "../route.js";
import {detach, tellShell} from "../platform/extension.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {usePoll} from "../poll.js";
import {follow} from "../composables/pointer.js";

const props = defineProps({floating: Boolean});
const JOURNALS_EVERY = 20000;
const shell = reactive({hosted: false, shut: false, journals: false, envs: false, driving: false, drivingUrl: ""});
const journals = ref([]);
const project = computed(() => (store.spec && store.spec.project) || "journal");
const environments = computed(() => rows("environment").map((e) => e.title));
const windowStyle = computed(() =>
    props.floating
        ? {
              left: `${store.chatWindow.x}px`,
              top: `${store.chatWindow.y}px`,
              width: `${store.chatWindow.w}px`,
              height: `${store.chatWindow.h}px`,
          }
        : null
);

function toShell(op, extra) {
    if (framed) tellShell(op, extra || {});
}

function fromShell(e) {
    if (e.source !== window.parent || e.source === window || !e.data || e.data.source !== "journal-extension" || e.data.kind !== "shell")
        return;
    shell.hosted = true;
    if ("shut" in e.data) shell.shut = !!e.data.shut;
    if ("driving" in e.data) {
        shell.driving = !!e.data.driving;
        shell.drivingUrl = e.data.drivingUrl || "";
    }
}
window.addEventListener("message", fromShell);
onUnmounted(() => window.removeEventListener("message", fromShell));
toShell("hello");

function drag(e) {
    if (e.button || e.target.closest("button, .shell-menu")) return;
    e.preventDefault();
    const from = {px: e.clientX, py: e.clientY, x: store.chatWindow.x, y: store.chatWindow.y};
    if (!props.floating) toShell("drag", {sx: e.screenX, sy: e.screenY});
    follow(
        e,
        (ev) => {
            if (!props.floating) return toShell("dragmove", {sx: ev.screenX, sy: ev.screenY});
            store.chatWindow.x = Math.min(Math.max(-store.chatWindow.w + 90, from.x + ev.clientX - from.px), window.innerWidth - 90);
            store.chatWindow.y = Math.min(Math.max(0, from.y + ev.clientY - from.py), window.innerHeight - 40);
        },
        () => !props.floating && toShell("dragend")
    );
}

function resize(e) {
    e.preventDefault();
    const from = {px: e.clientX, py: e.clientY, w: store.chatWindow.w, h: store.chatWindow.h};
    follow(e, (ev) => {
        store.chatWindow.w = Math.max(320, Math.min(from.w + ev.clientX - from.px, window.innerWidth - 24));
        store.chatWindow.h = Math.max(260, Math.min(from.h + ev.clientY - from.py, window.innerHeight - 24));
    });
}

function drive(on) {
    toShell("drive", {on});
}

function fold() {
    shell.shut = !shell.shut;
    if (!props.floating) toShell(shell.shut ? "shut" : "open");
}

function pick(name) {
    shell.journals = false;
    shell.envs = false;
    toShell("pick", {url: location.origin, env: name});
    go(name);
}

usePoll(
    "journals",
    () => api.journals(),
    JOURNALS_EVERY,
    (got) => (journals.value = got)
);

function pickJournal(journal) {
    shell.journals = false;
    const url = api.journal(journal).origin();
    toShell("pick", {url, env: ""});
    if (!journal.current) location.href = `${url}/?chat`;
}

function outside(e) {
    if (e.target.closest(".shell-menu, .shell-pick")) return;
    shell.journals = false;
    shell.envs = false;
}

onMounted(() => document.addEventListener("mousedown", outside));
onUnmounted(() => document.removeEventListener("mousedown", outside));

function close() {
    if (props.floating) detach(false);
    else if (framed) toShell("close");
    else window.close();
}
</script>

<template>
    <div :class="['chat-window', {floating, shut: shell.shut}]" :style="windowStyle">
        <template v-if="shell.hosted || floating">
            <div class="shell-bar" @pointerdown="drag">
                <span class="shell-dot" />
                <span class="shell-name">
                    <ShellPicker
                        :label="project"
                        title="Switch journal"
                        :open="shell.journals"
                        :options="journals.map((journal) => ({key: journal.port, label: journal.project, on: journal.current, journal}))"
                        @toggle="(shell.journals = !shell.journals), (shell.envs = false)"
                        @pick="pickJournal($event.journal)"
                    />
                    <span class="shell-sep">·</span>
                    <ShellPicker
                        :label="route.env"
                        title="Switch environment"
                        :open="shell.envs"
                        :options="environments.map((name) => ({key: name, label: name, on: name === route.env}))"
                        @toggle="(shell.envs = !shell.envs), (shell.journals = false)"
                        @pick="pick($event.key)"
                    />
                </span>
                <template v-if="!shell.driving">
                    <button
                        type="button"
                        class="shell-btn shell-wheel"
                        title="Let the agent drive this tab: see it, click and type on it"
                        @click="drive(true)"
                    >
                        <Icon name="wheel" />
                    </button>
                </template>
                <button type="button" class="shell-btn" :title="shell.shut ? 'Restore' : 'Minimize'" @click="fold">
                    {{ shell.shut ? "▴" : "–" }}
                </button>
                <button type="button" class="shell-btn" title="Close" @click="close">×</button>
            </div>
        </template>
        <template v-if="shell.driving">
            <div class="shell-driving">
                <span class="shell-driving-dot" />
                <span class="shell-driving-text">The agent is driving this tab{{ shell.drivingUrl ? ` — ${shell.drivingUrl}` : "" }}</span>
                <button type="button" class="shell-driving-stop" @click="drive(false)">Stop</button>
            </div>
        </template>
        <AgentBar standalone />
        <template v-if="!shell.shut">
            <Thread />
        </template>
        <template v-if="floating && !shell.shut">
            <span class="shell-grip" @pointerdown="resize" />
        </template>
    </div>
</template>

<style scoped>
.chat-window {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.chat-window.floating {
    position: fixed;
    z-index: 90;
    min-width: 320px;
    min-height: 260px;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

.chat-window.floating.shut {
    min-height: 0;
    height: auto !important;
}

.shell-grip {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
}

.shell-grip::after {
    content: "";
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 7px;
    height: 7px;
    border-right: 2px solid var(--text-3);
    border-bottom: 2px solid var(--text-3);
}

.chat-window > :deep(.thread) {
    padding: 0 12px;
}

.shell-bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 6px 0 10px;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
    cursor: grab;
    user-select: none;
}

.shell-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
}

.shell-name {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-2);
}

.shell-sep {
    color: var(--text-3);
}

.shell-btn {
    width: 24px;
    height: 22px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-3);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
}

.shell-btn:hover {
    background: var(--hover);
    color: var(--text);
}

.shell-wheel .ico {
    width: 13px;
    height: 13px;
}

.shell-driving {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 8px 0 10px;
    border-bottom: 1px solid color-mix(in srgb, var(--blocking) 45%, var(--border));
    background: color-mix(in srgb, var(--blocking) 26%, var(--bg));
    font-size: 11.5px;
    color: var(--text);
}

.shell-driving-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--blocking);
    animation: blink 1.2s ease-in-out infinite;
}

@keyframes blink {
    0%,
    100% {
        opacity: 0.4;
    }

    50% {
        opacity: 1;
    }
}

.shell-driving-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shell-driving-stop {
    height: 22px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--blocking) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--blocking) 30%, transparent);
    color: var(--text);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}
</style>
