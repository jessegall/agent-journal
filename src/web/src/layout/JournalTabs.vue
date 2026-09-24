<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import {STATE_WORDS, isActive, journalState, useHub} from "../sync/hub.js";
import {stateOf} from "./statusline.js";
import {agent} from "../state/store.js";
import {rows} from "../sync/rows.js";

const {running} = useHub();
const LOOK = {waiting: "waiting", idle: "idle", stopped: "idle"};
const tabs = computed(() =>
    running.value
        .filter((j) => !j.gone)
        .sort((a, b) => a.project.localeCompare(b.project))
        .map((j) => {
            const state = j.current ? stateOf(agent.value, rows("work")) : journalState(j);
            return {
                key: j.root,
                project: j.project,
                current: !!j.current,
                look: isActive(state) && state !== "waiting" ? "working" : LOOK[state] || "idle",
                word: STATE_WORDS[state] || "",
                href: j.current ? null : api.journal(j).page((j.summary && j.summary.start) || ""),
            };
        })
);
</script>

<template>
    <span class="journal-tabs" role="tablist" aria-label="Running journals">
        <template v-for="t in tabs" :key="t.key">
            <a
                role="tab"
                :aria-selected="t.current"
                :class="['journal-tab', {current: t.current}]"
                :href="t.href || undefined"
                :title="`${t.project} · ${t.word}`"
            >
                <span :class="['journal-tab-dot', t.look]" />
                <span class="journal-tab-name">{{ t.project }}</span>
            </a>
        </template>
    </span>
</template>

<style scoped>
.journal-tabs {
    display: flex;
    align-items: flex-end;
    align-self: stretch;
    gap: 1px;
    margin-left: auto;
    min-width: 0;
    overflow: hidden;
}

.journal-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 180px;
    height: 24px;
    padding: 0 10px;
    border-radius: 6px 6px 0 0;
    color: var(--text-4);
    font-size: 11.5px;
    text-decoration: none;
    transition:
        background 0.15s,
        color 0.15s;
}

.journal-tab:hover {
    background: var(--hover);
    color: var(--text-2);
}

.journal-tab.current {
    background: var(--bg);
    color: var(--text);
    cursor: default;
}

.journal-tab-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.journal-tab-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1.5px solid var(--text-4);
}

.journal-tab-dot.working {
    border-color: var(--accent);
    background: var(--accent);
}

.journal-tab-dot.waiting {
    border-color: var(--text-2);
}
</style>
