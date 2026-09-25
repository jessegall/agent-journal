<script setup>
import {ref} from "vue";
import {useSighted} from "../composables/scrollback.js";
import {stamp} from "../format/time.js";
import {route} from "../route.js";
import {render} from "../text/index.js";
import "../text/all.js";

const props = defineProps({
    transcript: {type: Object, required: true},
    entries: {type: Array, required: true},
    env: {type: String, default: ""},
});
const {turns, folded, error, loading, paging, atStart, toggle, earlier, retry} = props.transcript;
const scroller = ref(null);
const topMark = ref(null);
const WHO = {
    human: "You",
    agent: "Agent",
    tool: "Tool result",
    injected: "Journal",
    task: "Task",
    peer: "Another session",
    summary: "Summary",
    superseded: "You, edited",
    whisper: "Journal said",
};
useSighted(topMark, earlier, {root: scroller, margin: "400px 0px"});
defineExpose({scroller});
</script>

<template>
    <div ref="scroller" class="transcript">
        <div ref="topMark" class="edge">
            {{
                paging
                    ? "Loading earlier rows…"
                    : atStart
                      ? "Start of the transcript."
                      : turns.length
                        ? "Earlier rows load as you scroll up."
                        : ""
            }}
        </div>
        <template v-if="error">
            <p class="read-error">
                {{ error }}
                <button type="button" @click="retry">Try again</button>
            </p>
        </template>
        <template v-if="loading && !turns.length">
            <p class="none">Loading…</p>
        </template>
        <template v-else-if="!turns.length && !error">
            <p class="none">Nothing printed yet, or no transcript on this row.</p>
        </template>
        <template v-for="t in entries" :key="t.line">
            <div :class="['turn', t.kind, {folded: folded.has(t.line)}]">
                <div class="meta">
                    <button type="button" class="who" :aria-expanded="t.text ? !folded.has(t.line) : undefined" @click="toggle(t.line)">
                        {{ WHO[t.kind] || t.kind }}
                        <template v-if="t.text">
                            <span class="fold-mark">{{ folded.has(t.line) ? "show" : "hide" }}</span>
                        </template>
                    </button>
                    <span class="when">{{ stamp(t.at) }}</span>
                    <span class="line">{{ t.kind === "whisper" ? t.line : `#${t.line}` }}</span>
                    <template v-if="t.tools.length">
                        <span class="tools">used {{ t.tools.join(", ") }}</span>
                    </template>
                </div>
                <template v-if="t.text && !folded.has(t.line)">
                    <template v-if="t.kind === 'agent' || t.kind === 'human'">
                        <div class="turn-text" v-html="render(t.text, {types: [], env: env || route.env})" />
                    </template>
                    <template v-else>
                        <pre class="raw">{{ t.text }}</pre>
                    </template>
                    <template v-if="t.clipped">
                        <span class="clipped">Cut short here.</span>
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.transcript {
    max-height: 70vh;
    overflow-y: auto;
    font-size: 12.5px;
}

.none {
    margin: 0;
    color: var(--text-3);
}

.read-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 0 8px;
    color: var(--blocking);
}

.read-error button {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
}

.edge {
    padding: 14px 0;
    font-size: 12px;
    color: var(--text-3);
    text-align: center;
}

.turn {
    padding: 8px 2px;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
}

.turn.superseded {
    opacity: 0.62;
}

.turn.superseded .turn-text {
    text-decoration: line-through;
}

.turn.whisper {
    padding-left: 10px;
    border-left: 2px solid var(--accent-dim);
}

.turn.whisper .who {
    color: var(--accent-text);
}

.meta {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 11.5px;
    color: var(--text-3);
}

.who {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
}

.fold-mark {
    margin-left: 5px;
    color: var(--text-4);
    font-weight: 400;
}

.turn.human .who {
    color: var(--accent-text);
}

.line {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
    opacity: 0.7;
}

.tools {
    color: var(--text-3);
}

.turn-text {
    margin-top: 4px;
    line-height: 1.5;
    color: var(--text);
}

.raw {
    max-height: 280px;
    margin: 4px 0 0;
    overflow: auto;
    font: inherit;
    font-size: 12.5px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: var(--text-2);
}

.clipped {
    font-size: 11px;
    color: var(--text-4);
}

.turn-text :deep(p) {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.turn-text :deep(p + p) {
    margin-top: 0.5em;
}
</style>
