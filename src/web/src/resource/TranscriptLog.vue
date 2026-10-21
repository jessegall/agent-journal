<script setup>
import {ref} from "vue";
import {useScrollback} from "../composables/scrollback.js";
import {stamp} from "../format/time.js";
import {route} from "../route.js";
import {render} from "../text/index.js";
import "../text/all.js";
import Skeleton from "../kit/Skeleton.vue";

const props = defineProps({
    transcript: {type: Object, required: true},
    entries: {type: Array, required: true},
    env: {type: String, default: ""},
});
const {
    turns,
    folded,
    bodies,
    opening,
    unread,
    error,
    loading,
    paging,
    atStart,
    toggle,
    earlier,
    retry,
    missed,
    showNewest,
    toNewest,
    scrolled,
} = props.transcript;
const hasBody = (t) => Boolean(t.text || t.has_text);
const bodyOf = (t) => t.text || bodies.value[t.line] || "";
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
useScrollback(scroller, topMark, earlier, {margin: "400px 0px"});
defineExpose({scroller});
</script>

<template>
    <div ref="scroller" class="transcript" @scroll="scrolled">
        <div class="transcript-foot">
            <Transition name="rise">
                <button
                    v-if="showNewest"
                    type="button"
                    class="transcript-newest"
                    :title="missed ? `${missed} arrived while you were reading` : 'Back to the newest'"
                    @click="toNewest()"
                >
                    {{ missed ? `${missed} new` : "Newest" }}
                </button>
            </Transition>
        </div>
        <div ref="topMark" class="edge">
            {{
                paging
                    ? "Loading earlier entries…"
                    : atStart
                      ? "Start of the transcript."
                      : turns.length
                        ? "Earlier rows load as you scroll up."
                        : ""
            }}
        </div>
        <template v-if="paging">
            <Skeleton shape="older" label="Loading earlier entries" />
        </template>
        <template v-if="error">
            <p class="read-error">
                {{ error }}
                <button type="button" @click="retry">Try again</button>
            </p>
        </template>
        <template v-if="loading && !turns.length">
            <Skeleton label="Loading the transcript" />
        </template>
        <template v-else-if="!turns.length && !error">
            <p class="none">Nothing printed yet, or no transcript for this session.</p>
        </template>
        <template v-for="t in entries" :key="t.line">
            <div :class="['turn', t.kind, {folded: folded.has(t.line)}]">
                <div class="meta">
                    <button type="button" class="who" :aria-expanded="hasBody(t) ? !folded.has(t.line) : undefined" @click="toggle(t.line)">
                        {{ WHO[t.kind] || t.kind }}
                        <template v-if="hasBody(t)">
                            <span class="fold-mark">{{ folded.has(t.line) ? "show" : "hide" }}</span>
                        </template>
                    </button>
                    <span class="when">{{ stamp(t.time) }}</span>
                    <span class="line">{{ t.kind === "whisper" ? t.line : `#${t.line}` }}</span>
                    <template v-if="t.tools.length">
                        <span class="tools">used {{ t.tools.join(", ") }}</span>
                    </template>
                </div>
                <template v-if="hasBody(t) && !folded.has(t.line)">
                    <template v-if="opening.has(t.line)">
                        <span class="note">Loading…</span>
                    </template>
                    <template v-else-if="unread[t.line]">
                        <span class="note">Could not load this entry: {{ unread[t.line] }}</span>
                    </template>
                    <template v-else-if="t.kind === 'agent' || t.kind === 'human'">
                        <div class="turn-text" v-html="render(bodyOf(t), {types: [], env: env || route.env})" />
                    </template>
                    <template v-else>
                        <pre class="raw">{{ bodyOf(t) }}</pre>
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
    padding: 8px 16px;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
}

.turn.superseded {
    opacity: 0.62;
}

.turn.superseded .turn-text {
    text-decoration: line-through;
}

.turn.whisper {
    padding-left: 14px;
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

.note {
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

.transcript-foot {
    position: sticky;
    bottom: 12px;
    z-index: 2;
    height: 0;
}

.transcript-newest {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--panel);
    color: var(--text);
    box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
    cursor: pointer;
}

.rise-enter-active,
.rise-leave-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}

.rise-enter-from,
.rise-leave-to {
    opacity: 0;
    transform: translate(-50%, 8px);
}
</style>
