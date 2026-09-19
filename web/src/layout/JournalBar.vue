<script setup>
import {computed, ref} from "vue";
import {act, saveSettings} from "../api.js";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import {age} from "../store.js";
import {lineOf, planButton, stateOf, wordOf} from "./statusline.js";

const props = defineProps({journal: {type: Object, required: true}, open: Boolean});
const emit = defineEmits(["toggle", "changed", "forget"]);
const error = ref("");

async function manage(fn) {
    error.value = "";
    try {
        await fn();
        emit("changed");
    } catch (e) {
        error.value = e.message;
    }
}

const setAuto = (e, on) => manage(() => saveSettings(e.name, {features: {auto: on}}, base.value));
const runPlan = (e, p) => manage(() => act(e.name, "plan", p.n, planButton({data: p})[0], {}, base.value));
const wordFor = (p) => (planButton({data: p}) || [])[1];
const at = (e, page = "") => `${base.value}/#/${e.name}${page ? `/${page}` : ""}`;

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
    return props.journal.gone ? "the viewer stopped answering" : lineOf(agentOf(e), worksOf(e), e.auto && e.counts.todos > 0);
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
    <section :class="['jbar', {open, gone: journal.gone || !journal.running}]">
        <button type="button" class="jbar-head" :aria-expanded="open" @click="emit('toggle')">
            <span :class="['jbar-dot', {live}]" />
            <span class="jbar-project">{{ journal.project }}</span>
            <template v-if="!journal.running">
                <span class="jbar-state">Stopped</span>
                <span class="jbar-line">run journal claude in {{ journal.root.replace(/\/\.journal$/, "") }}</span>
            </template>
            <template v-else-if="!journal.summary">
                <span class="jbar-line">this viewer is on {{ journal.version || "an older version" }} — the hub reads 2.3.0 and up</span>
            </template>
            <template v-else-if="reporting">
                <span class="jbar-env">{{ reporting.name }}</span>
                <span class="jbar-state">{{ wordOf(stateFor(reporting), reporting.auto && reporting.counts.todos > 0) }}</span>
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
                {{ journal.running ? (journal.current ? "this one" : `port ${journal.port}`) : `last seen ${age(journal.at)} ago`
                }}{{ journal.version ? ` · ${journal.version}` : "" }}
            </span>
            <template v-if="journal.running">
                <Icon name="down" :size="12" class="jbar-fold" />
            </template>
            <template v-else>
                <span
                    class="jbar-forget"
                    role="button"
                    title="Take this journal off the hub until its viewer runs again"
                    @click.stop="emit('forget')"
                >
                    Forget
                </span>
            </template>
        </button>
        <template v-if="open && journal.summary">
            <div class="jbar-open">
                <a
                    class="jbar-go"
                    :href="`${base}/#/${journal.summary.start}`"
                    :target="journal.current ? '' : '_blank'"
                    title="Open this journal's viewer"
                >
                    <Icon name="open" :size="12" />
                    Open viewer
                </a>
                <a class="jbar-go" :href="`${base}/?chat`" target="_blank" title="Open this journal's chat in its own window">
                    <Icon name="bubble" :size="12" />
                    Open chat
                </a>
                <span v-if="error" class="jbar-error">{{ error }}</span>
            </div>
        </template>
        <div v-if="open && journal.summary" class="jbar-body">
            <div v-for="e in environments" :key="e.name" class="jbar-row">
                <div class="jbar-envline">
                    <span :class="['jbar-dot', {live: stateFor(e) !== 'stopped'}]" />
                    <a class="jbar-envname" :href="`${base}/#/${e.name}`">{{ e.name }}</a>
                    <span class="jbar-state">{{ wordOf(stateFor(e), e.auto && e.counts.todos > 0) }}</span>
                    <span class="jbar-line">{{ lineFor(e) }}</span>
                    <span class="jbar-counts">
                        <template v-for="[key, n, what] in counts(e.counts)" :key="key">
                            <a v-if="n" :class="['jbar-count', key]" :title="`${n} ${what}`" :href="at(e, key === 'todos' ? 'todo' : '')">
                                <Icon :name="key === 'messages' ? 'mail' : key === 'questions' ? 'help' : 'todos'" :size="12" />
                                {{ n }}
                            </a>
                        </template>
                    </span>
                    <Switch
                        :on="e.auto"
                        word="auto"
                        :title="
                            e.auto
                                ? 'The agent works through the to-do list without asking'
                                : 'The agent asks before picking up the next to-do'
                        "
                        @change="(on) => setAuto(e, on)"
                    />
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
                    <template v-if="p.phase">
                        <span class="jbar-plan-phase">· {{ p.phase }}</span>
                    </template>
                    <span class="jbar-plan-step">{{ p.current || 1 }}</span>
                    <span class="jbar-track" role="progressbar">
                        <span :style="{width: `${(100 * p.done) / Math.max(1, p.rows)}%`}" />
                    </span>
                    <button v-if="wordFor(p)" type="button" :class="['jbar-act', {ack: p.status === 'done'}]" @click="runPlan(e, p)">
                        {{ wordFor(p) }}
                        <Icon name="arrow" />
                    </button>
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
    color: inherit;
}

a.jbar-count:hover {
    color: var(--text);
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

.jbar-forget {
    flex: none;
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 11px;
}

.jbar-forget:hover {
    background: var(--raised);
    color: var(--text);
}

.jbar-fold {
    flex: none;
    color: var(--text-3);
    transition: transform 0.18s ease;
}

.jbar.open .jbar-fold {
    transform: rotate(180deg);
}

.jbar-open {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 34px;
    padding: 0 16px 0 20px;
    border-top: 1px solid var(--line);
    font-size: 12px;
}

.jbar-go {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-2);
}

.jbar-go:hover {
    color: var(--text);
}

.jbar-error {
    margin-left: auto;
    color: var(--danger);
    font-size: 11px;
}

.jbar-act {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--text);
    font-size: 11px;
    cursor: pointer;
}

.jbar-act:hover {
    background: color-mix(in srgb, var(--accent) 34%, transparent);
}

.jbar-act .ico {
    width: 11px;
    height: 11px;
    color: inherit;
}

.jbar-act.ack {
    border-color: var(--border-2);
    background: var(--raised);
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
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
}

.jbar-plan-step {
    flex: none;
    margin-left: auto;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
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
