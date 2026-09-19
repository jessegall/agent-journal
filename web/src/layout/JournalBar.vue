<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {age} from "../store.js";
import {capital, lineOf, stateOf} from "./statusline.js";

const props = defineProps({journal: {type: Object, required: true}, open: Boolean});
const emit = defineEmits(["toggle"]);

function worksOf(e) {
    const row = (w, completed) => ({...w, completed, data: {todo: w.todo}});
    const works = [];
    if (e.last && (!e.work || e.last.n !== e.work.n)) works.push(row(e.last, 1));
    if (e.work) works.push(row(e.work, 0));
    return works;
}

function agentOf(e) {
    return e.agent ? {data: e.agent} : null;
}

function stateFor(e) {
    return props.journal.gone ? "stopped" : stateOf(agentOf(e), worksOf(e));
}

function lineFor(e) {
    return props.journal.gone ? "the viewer stopped answering" : lineOf(agentOf(e), worksOf(e));
}

const environments = computed(() => (props.journal.summary || {}).environments || []);
const reporting = computed(() => {
    const live = environments.value.filter((e) => e.agent && e.agent.status !== "stopped");
    if (live.length) return live.sort((a, b) => (b.agent.at || 0) - (a.agent.at || 0))[0];
    return environments.value.find((e) => e.name === props.journal.summary.start) || environments.value[0] || null;
});
const live = computed(() => !props.journal.gone && environments.value.some((e) => stateFor(e) !== "stopped"));
const totals = computed(() =>
    environments.value.reduce(
        (sum, e) => ({
            messages: sum.messages + e.counts.messages,
            questions: sum.questions + e.counts.questions,
            todos: sum.todos + e.counts.todos,
        }),
        {messages: 0, questions: 0, todos: 0}
    )
);
const base = computed(() => (props.journal.current ? "" : `http://127.0.0.1:${props.journal.port}`));
const counts = (c) => [
    ["messages", c.messages, "unread messages"],
    ["questions", c.questions, "questions waiting"],
    ["todos", c.todos, "open to-dos"],
];
</script>

<template>
    <section :class="['jbar', {open, gone: journal.gone}]">
        <button type="button" class="jbar-head" :aria-expanded="open" @click="emit('toggle')">
            <span :class="['jbar-dot', {live}]" />
            <span class="jbar-project">{{ journal.project }}</span>
            <template v-if="!journal.summary">
                <span class="jbar-line">this viewer is on {{ journal.version || "an older version" }} — the hub reads 2.3.0 and up</span>
            </template>
            <template v-else-if="reporting">
                <span class="jbar-env">{{ reporting.name }}</span>
                <span class="jbar-state">{{ capital(stateFor(reporting)) }}</span>
                <span class="jbar-line">{{ lineFor(reporting) }}</span>
            </template>
            <span class="jbar-counts">
                <template v-for="[key, n, what] in counts(totals)" :key="key">
                    <span v-if="n" :class="['jbar-count', key]" :title="`${n} ${what}`">
                        <Icon :name="key === 'messages' ? 'mail' : key === 'questions' ? 'help' : 'todos'" :size="12" />
                        {{ n }}
                    </span>
                </template>
            </span>
            <span class="jbar-meta">
                {{ journal.current ? "this one" : `port ${journal.port}` }}{{ journal.version ? ` · ${journal.version}` : "" }}
            </span>
            <Icon name="down" :size="12" class="jbar-fold" />
        </button>
        <div v-if="open && journal.summary" class="jbar-body">
            <div v-for="e in environments" :key="e.name" class="jbar-row">
                <div class="jbar-envline">
                    <span :class="['jbar-dot', {live: stateFor(e) !== 'stopped'}]" />
                    <a class="jbar-envname" :href="`${base}/#/${e.name}`">{{ e.name }}</a>
                    <span class="jbar-state">{{ capital(stateFor(e)) }}</span>
                    <span class="jbar-line">{{ lineFor(e) }}</span>
                    <span class="jbar-counts">
                        <template v-for="[key, n, what] in counts(e.counts)" :key="key">
                            <span v-if="n" :class="['jbar-count', key]" :title="`${n} ${what}`">
                                <Icon :name="key === 'messages' ? 'mail' : key === 'questions' ? 'help' : 'todos'" :size="12" />
                                {{ n }}
                            </span>
                        </template>
                    </span>
                    <span class="jbar-agent">
                        <template v-if="e.agent && e.agent.status !== 'stopped'">
                            {{ e.agent.provider }}{{ e.agent.model ? ` · ${e.agent.model}` : "" }} · context
                            {{ Math.round(e.agent.context || 0) }}% ·
                            {{ age(e.agent.at) }}
                        </template>
                    </span>
                </div>
                <div v-for="p in e.plans" :key="p.n" :class="['jbar-plan', `jbar-plan-${p.status}`]">
                    <span class="jbar-plan-n">Plan</span>
                    <span class="jbar-plan-title">{{ p.title }}</span>
                    <span class="jbar-plan-phase">{{ p.phase ? `phase ${p.current}, ${p.phase}` : "" }}</span>
                    <span class="jbar-track" role="progressbar">
                        <span :style="{width: `${(100 * p.done) / Math.max(1, p.phases)}%`}" />
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.jbar {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #17181b;
    overflow: hidden;
}

.jbar.gone {
    opacity: 0.55;
}

.jbar-head {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px 0 20px;
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.jbar-head:hover {
    background: #1b1c20;
}

.jbar-dot {
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background: var(--text-3);
}

.jbar-dot.live {
    background: var(--accent);
}

.jbar-project {
    flex: none;
    font-weight: 600;
    font-size: 13.5px;
}

.jbar-env {
    flex: none;
    padding: 1px 7px;
    border-radius: 6px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 11.5px;
}

.jbar-state {
    flex: none;
    font-weight: 500;
    font-size: 13px;
}

.jbar-line {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    color: var(--text-2);
}

.jbar-counts {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    font-size: 12px;
    color: var(--text-2);
}

.jbar-count {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.jbar-count.messages,
.jbar-count.questions {
    color: var(--accent-text);
}

.jbar-meta {
    flex: none;
    font-size: 11px;
    color: var(--text-3);
}

.jbar-fold {
    flex: none;
    color: var(--text-3);
    transition: transform 0.18s ease;
}

.jbar.open .jbar-fold {
    transform: rotate(180deg);
}

.jbar-body {
    border-top: 1px solid var(--line);
    background: var(--bg-2);
}

.jbar-row {
    border-bottom: 1px solid var(--line);
}

.jbar-row:last-child {
    border-bottom: none;
}

.jbar-envline {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    padding: 0 16px 0 20px;
}

.jbar-envname {
    flex: none;
    color: var(--text);
    font-weight: 500;
    font-size: 13px;
}

.jbar-envname:hover {
    color: var(--accent-text);
}

.jbar-agent {
    flex: none;
    font-size: 11px;
    color: var(--text-3);
}

.jbar-plan {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 30px;
    padding: 0 16px 0 40px;
    border-top: 1px solid var(--line);
    color: var(--text-2);
    font-size: 11.5px;
}

.jbar-plan-n {
    flex: none;
    font-weight: 600;
    color: var(--text);
}

.jbar-plan-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jbar-plan-phase {
    flex: none;
    margin-left: auto;
    color: var(--text-3);
    font-size: 11px;
}

.jbar-track {
    flex: none;
    width: 120px;
    height: 4px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.jbar-track > span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--accent);
    transition: width 0.3s ease;
}
</style>
