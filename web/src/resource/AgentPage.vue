<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api.js";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import Icon from "../kit/Icon.vue";
import {go, route, showSession} from "../route.js";
import {rows, span} from "../store.js";
import {render} from "../text/index.js";
import "../text/all.js";
import Trace from "./Trace.vue";
import AgentHooks from "./AgentHooks.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const data = computed(() => props.resource.data);
const family = computed(() => (data.value.model || "").match(/opus|sonnet|haiku|gpt[-\w.]*/i));
const name = computed(() => ({claude: "Claude Code", codex: "Codex"})[data.value.provider] || "agent");
const works = computed(() =>
    rows("work")
        .filter((w) => w.data.session === props.resource.title || (!w.data.session && !w.completed))
        .slice(-5)
        .reverse()
);
const state = computed(() => {
    const reported = data.value.status;
    return ["stopped", "idle", "compacting"].includes(reported) ? reported : works.value.some((w) => !w.completed) ? "working" : "busy";
});
const TABS = [
    ["transcript", "Transcript"],
    ["work", "Work"],
    ["hooks", "Hooks"],
];
const tab = ref("transcript");
const turns = ref([]);
const total = ref(0);
const first = ref(0);
const scroller = ref(null);
const topMark = ref(null);
const folded = ref(new Set());
const error = ref("");
const loading = ref(true);
const paging = ref(false);
let timer = null;
let fetching = false;

const WHO = {
    human: "You",
    agent: "Agent",
    tool: "Tool result",
    injected: "Journal",
    task: "Task",
    peer: "Another session",
    summary: "Summary",
    superseded: "You, edited",
};
const subagents = computed(() => (data.value.subagent_rows || []).filter((r) => r.session));
const session = computed(() => route.value.sub);
const picked = computed(() => subagents.value.find((r) => r.session === session.value));

function transcriptPath() {
    const base = `/${route.value.env}/agent/${props.resource.n}`;
    return session.value ? `${base}/subagent/${session.value}/transcript` : `${base}/transcript`;
}

const earliest = computed(() => (turns.value.length ? turns.value[0].line : 0));
const atStart = computed(() => turns.value.length > 0 && earliest.value <= first.value);

function when(epoch) {
    return epoch
        ? new Date(epoch * 1000).toLocaleString([], {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"})
        : "";
}

function toggle(line) {
    const next = new Set(folded.value);
    if (next.has(line)) next.delete(line);
    else next.add(line);
    folded.value = next;
}

function foldTools(fresh) {
    const next = new Set(folded.value);
    fresh.filter((turn) => turn.kind === "tool").forEach((turn) => next.add(turn.line));
    folded.value = next;
}

async function fetchTurns() {
    if (fetching) return;
    fetching = true;
    try {
        const since = turns.value.length ? turns.value[turns.value.length - 1].line : 0;
        const path = transcriptPath();
        const got = await api("GET", `${path}?since=${since}&last=200`);
        if (path !== transcriptPath()) return;
        error.value = "";
        total.value = got.total;
        first.value = got.first;
        if (!got.turns.length) return;
        const atBottom = !scroller.value || scroller.value.scrollHeight - scroller.value.scrollTop - scroller.value.clientHeight < 60;
        foldTools(got.turns);
        turns.value = [...turns.value, ...got.turns];
        if (atBottom) requestAnimationFrame(() => scroller.value && (scroller.value.scrollTop = scroller.value.scrollHeight));
    } catch (reason) {
        error.value = reason.message;
    } finally {
        fetching = false;
        loading.value = false;
    }
}

async function earlier() {
    if (paging.value || atStart.value || !turns.value.length) return;
    paging.value = true;
    const box = scroller.value;
    const fromBottom = box ? box.scrollHeight - box.scrollTop : 0;
    try {
        const path = transcriptPath();
        const got = await api("GET", `${path}?before=${earliest.value}&last=200`);
        if (path !== transcriptPath()) return;
        error.value = "";
        foldTools(got.turns);
        turns.value = [...got.turns, ...turns.value];
        await nextTick();
        if (box) box.scrollTop = box.scrollHeight - fromBottom;
    } catch (reason) {
        error.value = reason.message;
    } finally {
        paging.value = false;
    }
}

const retry = () => (turns.value.length && !atStart.value ? earlier() : fetchTurns());

watch(session, () => {
    turns.value = [];
    total.value = 0;
    first.value = 0;
    loading.value = true;
    error.value = "";
    tab.value = "transcript";
    fetchTurns();
});

let watcher = null;
onMounted(async () => {
    await fetchTurns();
    timer = setInterval(fetchTurns, 3000);
    watcher = new IntersectionObserver((seen) => seen.some((e) => e.isIntersecting) && earlier(), {
        root: scroller.value,
        rootMargin: "400px 0px",
    });
    if (topMark.value) watcher.observe(topMark.value);
});
onUnmounted(() => {
    clearInterval(timer);
    if (watcher) watcher.disconnect();
});
</script>

<template>
    <article class="body agent-page">
        <header class="top">
            <span class="kind">
                <Icon name="agents" :size="13" />
                Agent {{ resource.n }}
            </span>
            <span :class="['state', state]">{{ state }}</span>
            <span class="grow" />
            <CommentToggle />
            <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
        </header>
        <h2 class="title">{{ family ? `${name} · ${family[0].toLowerCase()}` : name }}</h2>
        <p class="session">session {{ resource.title }}</p>
        <div class="facts">
            <template v-if="data.branch">
                <span class="fact">
                    <Icon name="branch" />
                    {{ data.branch }}
                </span>
            </template>
            <span class="fact">
                <Icon name="reminders" />
                {{ data.started ? `up ${span(Date.now() / 1000 - data.started)}` : "just started" }}
            </span>
            <span class="fact">
                <Icon name="activity" />
                context {{ Math.round(Number(data.context || 0)) }}%
            </span>
            <span class="fact">
                <Icon name="terminal" />
                {{ data.shells || 0 }} shells
            </span>
            <span class="fact">
                <Icon name="agents" />
                {{ data.subagents || 0 }} subagents
            </span>
            <span class="fact">
                <Icon name="book" />
                {{ (data.skills || []).length }} skills
            </span>
        </div>
        <template v-if="(data.skills || []).length">
            <p class="skills">
                <span class="skills-label">Skills in this window</span>
                {{ data.skills.join(", ") }}
                <button type="button" class="every" @click="go(route.env, 'skills')">every skill</button>
            </p>
        </template>
        <div class="tabs" role="tablist">
            <template v-for="[key, label] in TABS" :key="key">
                <button type="button" role="tab" :aria-selected="tab === key" :class="['tab', {on: tab === key}]" @click="tab = key">
                    {{ label }}
                </button>
            </template>
            <span v-if="tab === 'transcript'" class="tab-note">
                {{ turns.length ? `${turns.length} of ${total} lines · live` : "live" }}
            </span>
        </div>
        <section v-if="tab === 'work'" class="block">
            <template v-for="w in works" :key="w.n">
                <div class="work">
                    <span :class="['dot', {open: !w.completed}]" />
                    <span class="work-title">{{ w.title }}</span>
                    <span class="work-when">{{ w.completed ? "ended" : "open" }}</span>
                </div>
                <Trace :resource="w" />
            </template>
            <p v-if="!works.length" class="none">No work on this agent yet.</p>
        </section>
        <section v-if="tab === 'hooks'" class="block">
            <AgentHooks :provider="data.provider" />
        </section>
        <section v-show="tab === 'transcript'" class="block">
            <div v-if="subagents.length" class="sessions">
                <button type="button" :class="['session-pick', {on: !session}]" @click="showSession('')">This session</button>
                <template v-for="r in subagents" :key="r.session">
                    <button
                        type="button"
                        :class="['session-pick', {on: session === r.session}]"
                        :title="r.type ? `${r.type} · ${r.model}` : r.model"
                        @click="showSession(r.session)"
                    >
                        <span :class="['dot', {open: r.running}]" />
                        {{ r.task }}
                    </button>
                </template>
            </div>
            <p v-if="picked" class="session-note">
                Subagent {{ picked.type || "" }} · {{ picked.model || "inherited model" }} ·
                {{
                    picked.running
                        ? `running ${span(Date.now() / 1000 - picked.at)}`
                        : `${picked.status || "finished"} after ${span(picked.ended - picked.at)}`
                }}
            </p>
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
                <p v-if="error" class="read-error">
                    {{ error }}
                    <button type="button" @click="retry">Try again</button>
                </p>
                <template v-if="loading && !turns.length">
                    <p class="none">Loading…</p>
                </template>
                <template v-else-if="!turns.length && !error">
                    <p class="none">Nothing printed yet, or no transcript on this row.</p>
                </template>
                <template v-for="t in turns" :key="t.line">
                    <div :class="['turn', t.kind, {folded: folded.has(t.line)}]">
                        <div class="meta">
                            <button
                                type="button"
                                class="who"
                                :aria-expanded="t.text ? !folded.has(t.line) : undefined"
                                @click="toggle(t.line)"
                            >
                                {{ WHO[t.kind] || t.kind }}
                                <span v-if="t.text" class="fold-mark">{{ folded.has(t.line) ? "show" : "hide" }}</span>
                            </button>
                            <span class="when">{{ when(t.at) }}</span>
                            <span class="line">#{{ t.line }}</span>
                            <template v-if="t.tools.length">
                                <span class="tools">used {{ t.tools.join(", ") }}</span>
                            </template>
                        </div>
                        <template v-if="t.text && !folded.has(t.line)">
                            <template v-if="t.kind === 'agent' || t.kind === 'human'">
                                <div class="said" v-html="render(t.text, {types: [], env: route.env})" />
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
        </section>
    </article>
</template>

<style scoped>
.agent-page {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
}

.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-text);
}

.state {
    padding: 1px 7px;
    border-radius: 99px;
    background: var(--raised);
    font-size: 11px;
    color: var(--text-3);
}

.state.working,
.state.busy,
.state.compacting {
    color: var(--progress);
}

.grow {
    flex: 1;
}

.title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
}

.session {
    margin: -6px 0 0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    color: var(--text-3);
}

.facts {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 12px;
    color: var(--text-2);
}

.fact {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.fact .ico {
    width: 12px;
    height: 12px;
    opacity: 0.65;
}

.block {
    margin-top: 12px;
}

.skills {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-3);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.skills-label {
    margin-right: 6px;
    color: var(--text-2);
}

.tabs {
    display: flex;
    align-items: stretch;
    gap: 16px;
    height: 32px;
    margin-top: 6px;
    border-bottom: 1px solid var(--border);
}

.tab {
    padding: 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    font-size: 12px;
    color: var(--text-3);
    cursor: pointer;
}

.tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.tab-note {
    margin-left: auto;
    align-self: center;
    font-size: 11px;
    color: var(--text-4);
}

.work {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.open {
    background: var(--progress);
}

.work-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.work-when {
    font-size: 11.5px;
    color: var(--text-3);
}

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

.turn.superseded .said {
    text-decoration: line-through;
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

.said {
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

.said :deep(p) {
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.said :deep(p + p) {
    margin-top: 0.5em;
}

.every {
    margin-left: 8px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 11px;
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
}
</style>
