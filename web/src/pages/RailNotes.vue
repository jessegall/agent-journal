<script setup>
import {computed, ref} from "vue";
import {act} from "../api.js";
import Icon from "../kit/Icon.vue";
import {peek, route} from "../route.js";
import {age, reload, rows} from "../store.js";

const sub = ref("unread");
const notes = computed(() => [...rows("notification")].reverse());
const unread = computed(() => notes.value.filter((n) => !n.seen.includes("user")));
const shown = computed(() => (sub.value === "unread" ? unread.value : notes.value.filter((n) => n.seen.includes("user"))));

async function openNote(n) {
    await act(route.value.env, "notification", n.n, "read");
    await reload();
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
    <div class="rail-list">
        <template v-for="n in shown" :key="n.n">
            <button type="button" :class="['rail-row', 'note-row', {read: n.seen.includes('user')}]" @click="openNote(n)">
                <span class="rail-note-head">
                    <span class="rail-row-title">{{ n.title }}</span>
                    <span class="rail-row-state">{{ age(n.created) }}</span>
                </span>
                <template v-if="n.abstract">
                    <span class="rail-note-text">{{ n.abstract }}</span>
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.rail-tabs {
    position: sticky;
    top: 33px;
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
</style>
