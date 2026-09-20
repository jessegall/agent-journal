<script setup>
import {computed, ref} from "vue";
import {act, readAll as readAllRows} from "../api.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import {peek, route} from "../route.js";
import {age, rows} from "../store.js";

const sub = ref("unread");
const notes = computed(() => [...rows("notification")].sort((a, b) => b.created - a.created));
const unread = computed(() => notes.value.filter((n) => !n.seen.includes("user")));
const shown = computed(() => (sub.value === "unread" ? unread.value : notes.value.filter((n) => n.seen.includes("user"))));
const reading = ref(false);
const noteTitle = (n) => {
    const number = (n.refs[0] || "").split(":")[1];
    return number ? n.title.replace(` ${number}`, "") : n.title;
};

async function readAll() {
    reading.value = true;
    try {
        await readAllRows(
            route.value.env,
            "notification",
            unread.value.map((n) => n.n)
        );
    } finally {
        reading.value = false;
    }
}

async function openNote(n) {
    await act(route.value.env, "notification", n.n, "read");
    const [type, num] = n.refs[0].split(":");
    peek(type, Number(num));
}
</script>

<template>
    <div class="rail-tabs rail-subtabs" role="tablist">
        <template
            v-for="[key, label, n] in [
                ['unread', 'Unread', unread.length],
                ['read', 'Read', notes.length - unread.length],
            ]"
            :key="key"
        >
            <button type="button" role="tab" :class="['rail-tab', {on: sub === key}]" @click="sub = key">
                {{ label }}
                <span :class="['rail-tab-n', {hot: n && key === 'unread'}]">{{ n }}</span>
            </button>
        </template>
    </div>
    <template v-if="!shown.length">
        <div class="home-rail-empty">
            <Icon name="bell" />
            <p>{{ sub === "unread" ? "Nothing new." : "Nothing has been read yet." }}</p>
        </div>
    </template>
    <TransitionGroup name="qrow" tag="div" class="rail-list">
        <button
            v-for="n in shown"
            :key="n.n"
            type="button"
            :class="['rail-row', 'note-row', {read: n.seen.includes('user')}]"
            @click="openNote(n)"
        >
            <span class="rail-note-head">
                <span class="rail-row-title">{{ noteTitle(n) }}</span>
            </span>
            <template v-if="n.abstract">
                <span class="rail-note-text">{{ n.abstract }}</span>
            </template>
            <span class="rail-note-foot">
                <span class="rail-note-ref">{{ n.refs[0] || "" }}</span>
                <span class="rail-row-state">{{ age(n.created) }}</span>
            </span>
        </button>
    </TransitionGroup>
    <template v-if="sub === 'unread' && unread.length">
        <div class="rail-foot">
            <button type="button" class="rail-foot-act" :disabled="reading" @click="readAll">
                <Spinner v-if="reading" />
                {{ reading ? "Marking…" : "Mark all as read" }}
            </button>
        </div>
    </template>
</template>

<style scoped>
.qrow-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.qrow-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.qrow-leave-active {
    position: absolute;
    left: 0;
    right: 0;
    transition:
        opacity 0.16s ease-in,
        transform 0.16s ease-in;
}

.qrow-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.qrow-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.rail-tabs {
    position: sticky;
    top: var(--rail-tabs-top, 33px);
    z-index: 1;
    flex: none;
    display: flex;
    align-items: stretch;
    height: 24px;
    margin-top: -1px;
    padding: 0 var(--rail-gutter);
    gap: 14px;
    border-bottom: 1px solid var(--border);
    background: var(--side);
}

.rail-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-4);
    cursor: pointer;
}

.rail-tab:hover {
    color: var(--text-3);
}

.rail-tab.on {
    color: var(--text-2);
    box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--accent) 55%, transparent);
}

.rail-tab-n {
    font-size: 10px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.rail-tab-n.hot {
    color: var(--accent-text);
}

.home-rail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 34px 18px 0;
    text-align: center;
    color: var(--text-3);
}

.home-rail-empty p {
    margin: 0;
    font-size: 11.5px;
}

.home-rail-empty .ico {
    width: 20px;
    height: 20px;
    opacity: 0.5;
}

.rail-list {
    position: relative;
    display: flex;
    flex-direction: column;
}

.rail-row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 3px;
    width: 100%;
    min-height: 36px;
    padding: 9px var(--rail-gutter);
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    text-align: left;
    color: var(--text-2);
    cursor: pointer;
}

.rail-row:hover {
    background: var(--hover);
}

.rail-note-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.rail-row.read .rail-note-head {
    opacity: 0.6;
}

.rail-row-title {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 12.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rail-row-state {
    flex: none;
    font-size: 11px;
    color: var(--text-3);
}

.rail-note-text {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
}
.rail-note-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-3);
    font-size: 10.5px;
}
.rail-note-ref {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
}
.rail-foot {
    position: sticky;
    bottom: 0;
    z-index: 2;
    flex: none;
    margin-top: auto;
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 var(--rail-gutter);
    border-top: 1px solid var(--border);
    background: var(--raised);
}

.rail-foot-act {
    flex: none;
    padding: 3px 9px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    font: inherit;
    font-size: 11px;
    letter-spacing: 0.02em;
    white-space: nowrap;
    color: var(--text-2);
    cursor: pointer;
}

.rail-foot-act:hover:not(:disabled) {
    color: var(--text);
    background: var(--hover);
    border-color: var(--border-2);
}

.rail-foot-act:disabled {
    color: var(--text-3);
    background: transparent;
    opacity: 0.5;
    cursor: default;
}
</style>
