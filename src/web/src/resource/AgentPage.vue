<script setup>
import CloseButton from "../kit/CloseButton.vue";
import TabBar from "../kit/TabBar.vue";
import {useSighted} from "../composables/scrollback.js";
import {useTranscript} from "../composables/transcript.js";
import {withWhispers} from "../domain/transcript.js";
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import CommentToggle from "./CommentToggle.vue";
import DropList from "../kit/DropList.vue";
import {modelFamily, providerName} from "../agents.js";
import Icon from "../kit/Icon.vue";
import {go, route, showSession} from "../route.js";
import {span} from "../format/time.js";
import {rows} from "../sync/rows.js";
import {render} from "../text/index.js";
import "../text/all.js";
import Trace from "./Trace.vue";
import AgentHooks from "./AgentHooks.vue";
import TaskList from "./TaskList.vue";
import AgentLinks from "./AgentLinks.vue";
import SubagentChat from "../chat/SubagentChat.vue";
import {usePoll} from "../poll.js";
import {stamp} from "../format/time.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const data = computed(() => props.resource.data);
const resourceTitle = computed(() => props.resource.title);
const family = computed(() => modelFamily(data.value.model));
const name = computed(() => providerName(data.value.provider));
const subagents = computed(() => (data.value.subagent_rows || []).filter((r) => r.session));
const session = computed(() => route.value.sub);
const picked = computed(() => subagents.value.find((r) => r.session === session.value));
const works = computed(() =>
    rows("work")
        .filter((w) =>
            picked.value
                ? w.data.agent === picked.value.session
                : !w.data.agent && (w.data.session === props.resource.title || (!w.data.session && !w.completed))
        )
        .slice(-5)
        .reverse()
);
const skills = computed(() => (picked.value ? picked.value.skills : data.value.skills) || []);
const sessions = computed(() => [
    {key: "", label: "This session", note: resourceTitle.value, running: data.value.status === "working"},
    ...subagents.value.map((r) => ({
        key: r.session,
        label: r.task || r.session,
        note: r.type || r.model || "",
        running: Boolean(r.running),
    })),
]);
const sessionLabel = computed(() => (sessions.value.find((s) => s.key === (session.value || "")) || sessions.value[0]).label);
const skillItems = computed(() => skills.value.map((name) => ({key: name, label: name})));
const state = computed(() => {
    const reported = data.value.status;
    return ["stopped", "idle", "compacting"].includes(reported) ? reported : works.value.some((w) => !w.completed) ? "working" : "busy";
});
const TABS = [
    {key: "transcript", title: "Transcript"},
    {key: "work", title: "Work"},
    {key: "hooks", title: "Hooks"},
];
const tabs = computed(() =>
    picked.value ? [{key: "chat", title: "Chat"}, TABS[0], {key: "tasks", title: "Tasks"}, ...TABS.slice(1)] : TABS
);
const TASKS_EVERY = 4000;
const tasks = ref([]);
usePoll(
    "subagent-tasks",
    () => (picked.value ? api.tasks(picked.value.session) : Promise.resolve([])),
    TASKS_EVERY,
    (got) => (tasks.value = got || [])
);
const tab = ref(picked.value ? "chat" : "transcript");
watch(
    () => picked.value && picked.value.session,
    (session) => (tab.value = session ? "chat" : "transcript")
);
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

const {turns, total, first, folded, error, loading, paging, atStart, toggle, earlier, retry} = useTranscript(
    () => props.resource.n,
    session,
    scroller
);
watch(session, () => (tab.value = "transcript"));
const entries = computed(() => withWhispers(turns.value, rows("nudge"), props.resource.title));
useSighted(topMark, earlier, {root: scroller, margin: "400px 0px"});
</script>

<template>
    <article class="body agent-page">
        <div class="agent-head">
            <header class="top">
                <span class="kind">
                    <Icon name="agents" :size="13" />
                    Agent {{ resource.n }}
                </span>
                <span :class="['state', state]">{{ state }}</span>
                <span class="grow" />
                <CommentToggle :resource="resource" />
                <CloseButton @click="emit('close')" />
            </header>
            <template v-if="!picked">
                <AgentLinks :agent="resource.n" />
            </template>
            <template v-if="picked">
                <h2 class="title">{{ picked.task }}</h2>
                <p class="session">subagent {{ picked.session }} of session {{ resource.title }}</p>
                <div class="facts">
                    <span class="fact">
                        <Icon name="agents" />
                        {{ picked.type || "general" }} · {{ picked.model || "inherited model" }}
                    </span>
                    <span class="fact">
                        <Icon name="reminders" />
                        {{
                            picked.running
                                ? `up ${span(Date.now() / 1000 - picked.at)}`
                                : `${picked.status || "finished"} after ${span(picked.ended - picked.at)}`
                        }}
                    </span>
                    <span class="fact">
                        <Icon name="book" />
                        {{ skills.length }} skills
                    </span>
                </div>
            </template>
            <template v-else>
                <h2 class="title">{{ family ? `${name} · ${family}` : name }}</h2>
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
            </template>
            <div class="pickers">
                <DropList
                    icon="agents"
                    :label="sessionLabel"
                    :items="sessions"
                    :picked="session || ''"
                    empty="No subagents yet"
                    @pick="(item) => showSession(item.key)"
                />
                <DropList
                    icon="book"
                    :label="`${skills.length} skills in this window`"
                    :items="skillItems"
                    empty="No skill loaded in this window"
                    @pick="() => go(route.env, 'skills')"
                />
                <template v-if="picked">
                    <AgentLinks :agent="resource.n" :session="picked.session" compact />
                </template>
            </div>
            <TabBar v-model="tab" class="agent-tabs" :tabs="tabs">
                <template v-if="tab === 'transcript'">
                    <span class="tab-note">
                        {{ turns.length ? `${turns.length} of ${total} lines · live` : "live" }}
                    </span>
                </template>
            </TabBar>
        </div>
        <template v-if="tab === 'work'">
            <section class="block">
                <template v-for="w in works" :key="w.n">
                    <div class="work">
                        <span :class="['dot', {open: !w.completed}]" />
                        <span class="work-title">{{ w.title }}</span>
                        <span class="work-when">{{ w.completed ? "ended" : "open" }}</span>
                    </div>
                    <Trace :resource="w" />
                </template>
                <template v-if="!works.length">
                    <p class="none">{{ picked ? "No work filed by this subagent." : "No work on this agent yet." }}</p>
                </template>
            </section>
        </template>
        <template v-if="tab === 'chat' && picked">
            <section class="block chat-block">
                <SubagentChat :turns="turns" :session="picked.session" :task="picked.task" />
            </section>
        </template>
        <template v-if="tab === 'tasks' && picked">
            <section class="block">
                <TaskList :tasks="tasks" />
            </section>
        </template>
        <template v-if="tab === 'hooks'">
            <section class="block">
                <AgentHooks :provider="data.provider" />
            </section>
        </template>
        <section v-show="tab === 'transcript'" class="block">
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
                            <button
                                type="button"
                                class="who"
                                :aria-expanded="t.text ? !folded.has(t.line) : undefined"
                                @click="toggle(t.line)"
                            >
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
                                <div class="turn-text" v-html="render(t.text, {types: [], env: route.env})" />
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
    box-sizing: border-box;
    height: 100%;
    padding-top: 0;
}

.block.chat-block {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 320px;
    margin: -10px -24px -24px;
}

.agent-head {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 -24px;
    padding: 18px 24px 0;
    background: var(--bg);
}

.top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 -24px;
    padding: 0 24px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
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

.pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.agent-tabs {
    display: flex;
    align-items: stretch;
    gap: 16px;
    height: 32px;
    margin: 2px -24px 0;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
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

.session-pick .dot {
    width: 6px;
    height: 6px;
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
