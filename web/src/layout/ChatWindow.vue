<script setup>
import {computed, onUnmounted, reactive} from "vue";
import Icon from "../kit/Icon.vue";
import AgentBar from "../chat/AgentBar.vue";
import Thread from "../chat/Thread.vue";
import {go, route} from "../route.js";
import {rows, store} from "../store.js";

const shell = reactive({hosted: false, shut: false, envs: false, driving: false, drivingUrl: ""});
const framed = window.parent !== window;
const project = computed(() => (store.spec && store.spec.project) || "journal");
const environments = computed(() => rows("environment").map((e) => e.title));

function toShell(op, extra) {
    if (framed) window.parent.postMessage({source: "journal-page", kind: "shell", op, ...(extra || {})}, "*");
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
    const bar = e.currentTarget;
    bar.setPointerCapture(e.pointerId);
    toShell("drag", {sx: e.screenX, sy: e.screenY});
    const move = (ev) => toShell("dragmove", {sx: ev.screenX, sy: ev.screenY});
    const done = (ev) => {
        bar.removeEventListener("pointermove", move);
        bar.removeEventListener("pointerup", done);
        bar.removeEventListener("pointercancel", done);
        bar.releasePointerCapture(ev.pointerId);
        toShell("dragend");
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", done);
    bar.addEventListener("pointercancel", done);
}

function drive(on) {
    toShell("drive", {on});
}

function fold() {
    shell.shut = !shell.shut;
    toShell(shell.shut ? "shut" : "open");
}

function pick(name) {
    shell.envs = false;
    toShell("pick", {url: location.origin, env: name});
    go(name);
}

function close() {
    if (framed) toShell("close");
    else window.close();
}
</script>

<template>
    <div class="chat-window">
        <template v-if="shell.hosted">
            <div class="shell-bar" @pointerdown="drag">
                <span class="shell-dot" />
                <span class="shell-name">
                    <span class="shell-word">{{ project }}</span>
                    <span class="shell-sep">·</span>
                    <span class="shell-pick-wrap">
                        <button type="button" class="shell-pick" title="Switch environment" @click="shell.envs = !shell.envs">
                            {{ route.env }}
                        </button>
                        <Transition name="drop">
                            <div v-if="shell.envs" class="shell-menu">
                                <template v-for="name in environments" :key="name">
                                    <button type="button" :class="['shell-row', {on: name === route.env}]" @click="pick(name)">
                                        {{ name }}
                                    </button>
                                </template>
                            </div>
                        </Transition>
                    </span>
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
        <AgentBar />
        <template v-if="!shell.shut">
            <Thread />
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

.shell-pick-wrap {
    position: relative;
}

.shell-pick {
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
}

.shell-pick:hover {
    background: var(--hover);
}

.shell-pick::after {
    content: " ▾";
    color: var(--text-3);
}

.shell-menu {
    position: absolute;
    top: 26px;
    left: 0;
    z-index: 70;
    min-width: 160px;
    max-height: 260px;
    overflow-y: auto;
    padding: 4px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);
}

.shell-row {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    padding: 6px 9px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
}

.shell-row:hover {
    background: var(--hover);
    color: var(--text);
}

.shell-row.on {
    color: var(--accent-text);
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

.drop-enter-active {
    transition:
        opacity 0.16s ease-out,
        transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.drop-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.drop-enter-from,
.drop-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
