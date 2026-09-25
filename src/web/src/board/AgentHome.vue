<script setup>
import {computed, provide, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import ListRow from "../kit/ListRow.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PresetList from "../kit/PresetList.vue";
import StateDot from "../kit/StateDot.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import FileFeed from "../chat/FileFeed.vue";
import SubagentChat from "../chat/SubagentChat.vue";
import TerminalWindow from "../chat/TerminalWindow.vue";
import RailTodos from "../pages/RailTodos.vue";
import PlanPage from "../resource/PlanPage.vue";
import TaskList from "../resource/TaskList.vue";
import TranscriptLog from "../resource/TranscriptLog.vue";
import AgentPanes from "./AgentPanes.vue";
import {scopeIn} from "../composables/scope.js";
import {useTranscript} from "../composables/transcript.js";
import {INSPECTOR_PRESETS, matches, thumbnail} from "../domain/panes.js";
import {levelOf} from "../domain/verbosity.js";
import {age} from "../format/time.js";
import {usePoll} from "../poll.js";
import {route} from "../route.js";

const props = defineProps({
    band: {type: Object, required: true},
    env: {type: String, default: ""},
    agent: {type: Object, default: null},
    session: {type: String, default: ""},
    chatSession: {type: String, default: ""},
    plan: {type: Number, default: 0},
    subagent: Boolean,
});
const EVERY = 5000;
const HISTORY = 30;
const VIEWS = {
    chat: {title: "Chat", icon: "chat"},
    terminal: {title: "Terminal", icon: "terminal"},
    transcript: {title: "Transcript", icon: "list"},
    history: {title: "History", icon: "clock"},
    tasks: {title: "Tasks", icon: "todos"},
    feed: {title: "File feed", icon: "edits"},
    todos: {title: "To-dos", icon: "todos"},
    plan: {title: "Plan", icon: "flag"},
};

const elsewhere = Boolean(props.env) && props.env !== route.value.env;
const scope = elsewhere ? scopeIn(props.env) : null;
if (scope) provide("scope", scope);
const there = scope ? scope.api : api;
const keyed = (what) => `agent-home:${props.env}:${props.session}:${props.band.label}:${what}`;

const found = ref(null);
const newest = (list) => [...list].sort((a, b) => b.updated - a.updated)[0] || null;
const own = (list) => list.find((row) => row.title === props.chatSession) || newest(list.filter((row) => !row.deleted && !row.data.parent));
usePoll(
    keyed("agent"),
    () => (!props.agent && elsewhere ? there.list("agent", {last: 20, completed: true}) : Promise.resolve(null)),
    EVERY,
    (got) => got && (found.value = own(got.rows))
);
const agent = computed(() => props.agent || found.value);

const works = ref([]);
const worked = (w) => (props.subagent ? w.data.agent === props.session : !w.data.agent);
usePoll(
    keyed("work"),
    () => there.list("work", {last: HISTORY, completed: true}),
    EVERY,
    (got) => got && (works.value = [...got.rows].filter((w) => !w.deleted && worked(w)).sort((a, b) => b.created - a.created))
);

const tasks = ref([]);
usePoll(
    keyed("tasks"),
    () => (props.subagent ? there.tasks(props.session) : Promise.resolve(null)),
    EVERY,
    (got) => got && (tasks.value = got)
);

const planRow = computed(() => (scope && props.plan ? scope.rows("plan").find((p) => p.n === props.plan) : null));
usePoll(
    keyed("rows"),
    async () => {
        if (!scope) return null;
        if (props.plan) await scope.holding("plan", [props.plan]);
        return scope.recent("todo", 80);
    },
    EVERY,
    () => {}
);

const log = ref(null);
const scroller = computed(() => log.value && log.value.scroller);
const transcript = useTranscript(() => (agent.value ? agent.value.n : 0), props.session, scroller, there);
const {turns} = transcript;

const available = computed(() =>
    props.subagent
        ? ["chat", "terminal", "transcript", "tasks", "history"]
        : ["chat", "terminal", "transcript", "history", "feed", "todos", ...(props.plan ? ["plan"] : [])]
);

const panes = ref(null);
const layoutMenu = ref(false);
const layoutOpener = ref(null);
const presets = computed(() =>
    INSPECTOR_PRESETS.map((p) => ({
        ...p,
        cells: thumbnail(p.shape),
        current: panes.value ? matches(panes.value.layout, p.shape) : false,
    }))
);

function pickPreset(key) {
    layoutMenu.value = false;
    panes.value.shape(INSPECTOR_PRESETS.find((p) => p.key === key).shape);
}
</script>

<template>
    <div class="agent-home">
        <header :class="['band', band.state.key]">
            <div class="band-main">
                <span class="band-kicker">
                    <Icon name="agents" :size="12" />
                    {{ band.kicker }}
                </span>
                <h2 class="band-title">
                    <span class="band-label">{{ band.label }}</span>
                    {{ band.title }}
                </h2>
                <span class="band-facts">
                    <StateDot :state="band.state.dot" />
                    <span class="band-state">{{ band.state.word }}</span>
                    <template v-if="band.reason">
                        <span class="band-reason">{{ band.reason }}</span>
                    </template>
                    <span class="band-where">{{ agent ? `agent ${agent.n}` : "its agent" }} · {{ env || route.env }}</span>
                </span>
            </div>
            <div class="band-tools">
                <span ref="layoutOpener">
                    <Btn small title="How this inspector's panes are laid out, for every agent" @click.stop="layoutMenu = !layoutMenu">
                        <Icon name="layout" :size="12" />
                        Layout
                    </Btn>
                </span>
                <slot name="actions" />
            </div>
        </header>
        <template v-if="layoutMenu">
            <MenuPanel :anchor="layoutOpener" align="end" :min-width="240" :max-width="300" @click.stop @close="layoutMenu = false">
                <PresetList :presets="presets" @pick="pickPreset" />
            </MenuPanel>
        </template>
        <AgentPanes ref="panes" :views="VIEWS" :available="available" :flushable="['feed']">
            <template #view="{view, pane, tune}">
                <SwitchCase :value="view">
                    <template #chat>
                        <SubagentChat :turns="turns" :session="chatSession || session" :typed="!subagent" read-only />
                    </template>
                    <template #transcript>
                        <TranscriptLog ref="log" class="fill" :transcript="transcript" :entries="turns" :env="env" />
                    </template>
                    <template #terminal>
                        <template v-if="subagent">
                            <p class="pane-note">
                                The terminal of its parent session, agent {{ agent ? agent.n : "" }}. Commands typed here go to that
                                session.
                            </p>
                        </template>
                        <template v-if="agent">
                            <TerminalWindow :key="`${agent.n}:${levelOf(pane)}`" class="fill" :agent="agent" :level="levelOf(pane)" />
                        </template>
                        <template v-else>
                            <EmptyState title="No agent yet">Its terminal shows here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #history>
                        <template v-if="!works.length">
                            <EmptyState title="No work logged yet">What this agent starts and finishes shows here.</EmptyState>
                        </template>
                        <div class="fill scroll">
                            <template v-for="w in works" :key="w.n">
                                <ListRow :kind="w.completed ? 'Done' : 'Working'" :title="w.title" :text="age(w.completed || w.created)" />
                            </template>
                        </div>
                    </template>
                    <template #tasks>
                        <div class="fill scroll padded">
                            <TaskList :tasks="tasks" />
                        </div>
                    </template>
                    <template #feed>
                        <template v-if="agent">
                            <FileFeed
                                :key="agent.n"
                                :agent="agent.n"
                                :flush="!!pane.flush"
                                :options="pane.feed || null"
                                @options="(feed) => tune({feed})"
                            />
                        </template>
                        <template v-else>
                            <EmptyState title="No agent yet">Its edits show here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #todos>
                        <div class="fill scroll">
                            <RailTodos />
                        </div>
                    </template>
                    <template #plan>
                        <template v-if="planRow">
                            <div class="fill scroll padded">
                                <PlanPage :resource="planRow" :closable="false" />
                            </div>
                        </template>
                        <template v-else>
                            <EmptyState title="Reading its plan">Plan {{ plan }} shows here once it has loaded.</EmptyState>
                        </template>
                    </template>
                </SwitchCase>
            </template>
        </AgentPanes>
    </div>
</template>

<style scoped>
.agent-home {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.band {
    display: flex;
    flex: none;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid color-mix(in srgb, var(--tone-commit) 35%, var(--border));
    border-left: 3px solid var(--tone-commit);
    background: color-mix(in srgb, var(--tone-commit) 13%, var(--bg));
}

.band-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.band-kicker {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--tone-commit);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.band-title {
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 15px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.band-label {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.band-facts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    color: var(--text-3);
    font-size: 12px;
}

.band-state {
    color: var(--text);
    font-weight: 500;
}

.band.waiting .band-state {
    color: var(--tone-warn);
}

.band.stuck .band-state {
    color: var(--danger);
}

.band-reason {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.band-where {
    font-family: var(--mono);
    font-size: 11px;
}

.band-tools {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
}

.fill {
    flex: 1;
    min-height: 0;
    max-height: none;
}

.scroll {
    overflow-y: auto;
}

.padded {
    padding: 12px 16px;
}

.pane-note {
    flex: none;
    margin: 0;
    padding: 6px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

@media (max-width: 700px) {
    .band {
        flex-direction: column;
    }

    .band-tools {
        justify-content: flex-start;
    }

    .band-main,
    .band-tools {
        align-self: stretch;
    }
}
</style>
