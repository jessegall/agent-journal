<script setup>
import {computed, provide, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import ListRow from "../kit/ListRow.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PresetList from "../kit/PresetList.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import FileFeed from "../chat/FileFeed.vue";
import SubagentChat from "../chat/SubagentChat.vue";
import TerminalWindow from "../chat/TerminalWindow.vue";
import Thread from "../chat/Thread.vue";
import RailTodos from "../rail/RailTodos.vue";
import AgentHooks from "../resource/AgentHooks.vue";
import PlanPage from "../resource/PlanPage.vue";
import TaskList from "../resource/TaskList.vue";
import TranscriptLog from "../resource/TranscriptLog.vue";
import AgentInspectorBands from "./AgentInspectorBands.vue";
import AgentInspectorHead from "./AgentInspectorHead.vue";
import AgentTodo from "./AgentTodo.vue";
import AgentPanes from "./AgentPanes.vue";
import {scopeIn} from "../composables/scope.js";
import {useTranscript} from "../composables/transcript.js";
import {briefOf} from "../domain/transcript.js";
import {INSPECTOR_PRESETS, matches, thumbnail} from "../domain/panes.js";
import {levelOf} from "../domain/verbosity.js";
import {agentOf, plainRefusal} from "../domain/agents.js";
import {age} from "../format/time.js";
import {pollKey, usePoll} from "../composables/poll.js";
import {PAGE, holding, rows} from "../sync/rows.js";
import {go, route} from "../route.js";

const props = defineProps({
    info: {type: Object, required: true},
    kind: {type: String, default: "helper"},
    env: {type: String, default: ""},
    agent: {type: Object, default: null},
    session: {type: String, default: ""},
    chatSession: {type: String, default: ""},
    plan: {type: Number, default: 0},
    subagents: {type: Array, default: () => []},
    skills: {type: Array, default: () => []},
    provider: {type: String, default: ""},
    run: {type: Function, default: async () => {}},
});
const emit = defineEmits(["back", "close", "open-subagent"]);
const EVERY = 5000;
const CHAT_TYPES = ["message", "comment", "question", "reaction", "doc", "agent", "work", "plan", "report", "todo", "notice"];
const HISTORY = PAGE;
const VIEWS = {
    chat: {title: "Chat", icon: "chat"},
    terminal: {title: "Terminal", icon: "terminal"},
    transcript: {title: "Transcript", icon: "list"},
    history: {title: "History", icon: "clock"},
    tasks: {title: "Its tasks", icon: "todos"},
    feed: {title: "Files changed", icon: "edits"},
    todos: {title: "To-dos", icon: "todos"},
    plan: {title: "Plan", icon: "flag"},
    subagents: {
        title: "Subagents",
        icon: "agents",
    },
    skills: {title: "Skills", icon: "book"},
    hooks: {title: "Hooks", icon: "activity"},
};
const subagent = props.kind === "subagent";

const elsewhere = Boolean(props.env) && props.env !== route.value.env;
const scope = elsewhere ? scopeIn(props.env) : null;
if (scope) provide("scope", scope);
const there = scope ? scope.api : api;
const rowsHere = scope ? scope.rows : rows;

const found = ref(null);
const looked = ref(false);
usePoll(
    pollKey(),
    () => (!props.agent && elsewhere ? there.list("agent", {last: 20, completed: true}) : Promise.resolve(null)),
    EVERY,
    (got) => {
        looked.value = true;
        if (got) found.value = agentOf(got.rows, props.chatSession, props.kind === "helper");
    }
);
const agent = computed(() => props.agent || found.value);

const works = ref([]);
const worksLoaded = ref(false);
const worked = (w) => (subagent ? w.data.agent === props.session : !w.data.agent);
usePoll(
    pollKey(),
    () => there.list("work", {last: HISTORY, completed: true}),
    EVERY,
    (got) => {
        if (!got) return;
        works.value = [...got.rows].filter((w) => !w.deleted && worked(w)).sort((a, b) => b.created - a.created);
        worksLoaded.value = true;
    }
);

const tasks = ref([]);
const tasksLoaded = ref(false);
usePoll(
    pollKey(),
    () => (subagent ? there.tasks(props.session) : Promise.resolve(null)),
    EVERY,
    (got) => {
        if (!got) return;
        tasks.value = got;
        tasksLoaded.value = true;
    }
);

const planRow = computed(() => (scope && props.plan ? scope.rows("plan").find((p) => p.n === props.plan) : null));
usePoll(
    pollKey(),
    async () => {
        if (!scope) return null;
        if (props.plan) await scope.holding("plan", [props.plan]);
        return scope.recentAll(CHAT_TYPES, PAGE);
    },
    EVERY,
    () => {}
);

const log = ref(null);
const scroller = computed(() => log.value && log.value.scroller);
const transcript = useTranscript(() => (agent.value ? agent.value.n : 0), props.session, scroller, there);
const {turns, total, loading: transcriptLoading} = transcript;

const AVAILABLE = {
    main: ["chat", "transcript", "terminal", "feed", "todos", "history", "subagents", "skills", "hooks"],
    subagent: ["chat", "transcript", "terminal", "tasks", "history"],
    helper: ["chat", "transcript", "terminal", "feed", "todos", "history"],
    ticket: ["chat", "transcript", "terminal", "feed", "todos", "history"],
    plan: ["chat", "transcript", "terminal", "feed", "todos", "history"],
};
const available = computed(() => [...(AVAILABLE[props.kind] || AVAILABLE.helper), ...(props.plan ? ["plan"] : [])]);

const panes = ref(null);
const todoN = ref(0);
const todo = computed(() => rowsHere("todo").find((row) => row.n === todoN.value) || null);
async function loadTodo(n) {
    todoN.value = n;
    await (scope ? scope.holding : holding)("todo", [n]);
}
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

const stateKey = computed(() => props.info.state.key);
const counts = computed(() => props.info.counts);
const link = computed(() => props.info.link);
const asking = ref("");
const refusal = ref("");
const actionOf = (key) => props.info.actions.find((action) => action.key === key);
const question = computed(() => (asking.value ? actionOf(asking.value) : null));

async function perform(key) {
    refusal.value = "";
    asking.value = "";
    try {
        await props.run(key);
    } catch (e) {
        refusal.value = plainRefusal(e.message, key);
    }
}

function choose(key) {
    const action = actionOf(key);
    if (action.confirm) asking.value = key;
    else perform(key);
}

const showing = (view) => panes.value && panes.value.show(view);
const openSkills = () => go(route.value.env, "skills");
</script>

<template>
    <div class="agent-inspector">
        <AgentInspectorHead :info="info" :asking="asking" @action="choose" @back="emit('back')" @close="emit('close')">
            <template #menu>
                <slot name="tools" />
            </template>
            <template #tools>
                <slot name="tools" />
                <span ref="layoutOpener">
                    <Btn
                        small
                        v-tip="`How the panes are laid out. It applies to every agent's inspector.`"
                        @click.stop="layoutMenu = !layoutMenu"
                    >
                        <Icon name="layout" :size="12" />
                        Change layout
                    </Btn>
                </span>
            </template>
            <template #facts>
                <template v-if="counts">
                    <Btn kind="text" class="inspector-link" @click="showing('subagents')">{{ counts.subagents }} subagents</Btn>
                    <Btn kind="text" class="inspector-link" @click="showing('skills')">{{ counts.skills }} skills loaded</Btn>
                </template>
                <template v-if="link">
                    <Btn kind="text" class="inspector-link" :href="link.href" target="_blank">{{ link.label }}</Btn>
                </template>
            </template>
        </AgentInspectorHead>
        <template v-if="layoutMenu">
            <MenuPanel :anchor="layoutOpener" align="end" :min-width="240" :max-width="300" @click.stop @close="layoutMenu = false">
                <PresetList :presets="presets" @pick="pickPreset" />
            </MenuPanel>
        </template>
        <AgentInspectorBands
            :confirm="question && question.confirm"
            :brief="info.brief || (subagent ? briefOf(turns) : null)"
            :report="info.report"
            :refusal="refusal"
            :state-key="stateKey"
            :plan="plan"
            :resume="actionOf('resume')"
            @cancel="asking = ''"
            @confirmed="perform(question.key)"
            @show-plan="showing('plan')"
            @resume="choose('resume')"
        />
        <AgentPanes ref="panes" :views="VIEWS" :available="available" :flushable="['feed']">
            <template #view="{view, pane, tune}">
                <SwitchCase :value="view">
                    <template #chat>
                        <template v-if="subagent">
                            <SubagentChat :turns="turns" :loading="transcriptLoading" :session="chatSession || session" read-only />
                        </template>
                        <template v-else>
                            <Thread view="chat" />
                        </template>
                    </template>
                    <template #transcript>
                        <TranscriptLog ref="log" class="fill" :transcript="transcript" :entries="turns" :env="env" />
                    </template>
                    <template #terminal>
                        <template v-if="subagent">
                            <EmptyState title="No terminal of its own">
                                A subagent's commands are not kept apart from its parent's, so nothing of the parent's shows here.
                            </EmptyState>
                        </template>
                        <template v-else-if="agent">
                            <TerminalWindow :key="`${agent.n}:${levelOf(pane)}`" class="fill" :agent="agent" :level="levelOf(pane)" />
                        </template>
                        <template v-else>
                            <EmptyState :loading="!looked" title="No agent yet">Its terminal shows here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #history>
                        <template v-if="!works.length">
                            <EmptyState :loading="!worksLoaded" title="No work logged yet">What this agent starts and finishes shows here.</EmptyState>
                        </template>
                        <div class="fill scroll">
                            <template v-for="w in works" :key="w.n">
                                <ListRow
                                    :kind="w.completed ? 'Closed' : 'Working'"
                                    :title="w.title"
                                    :text="age(w.completed || w.created)"
                                />
                            </template>
                        </div>
                    </template>
                    <template #tasks>
                        <template v-if="todo">
                            <AgentTodo :resource="todo" @close="todoN = 0" />
                        </template>
                        <template v-else>
                            <div class="fill scroll padded">
                                <TaskList :tasks="tasks" :loading="!tasksLoaded" @open="loadTodo" />
                            </div>
                        </template>
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
                            <EmptyState :loading="!looked" title="No agent yet">Its edits show here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #todos>
                        <template v-if="todo">
                            <AgentTodo :resource="todo" @close="todoN = 0" />
                        </template>
                        <template v-else>
                            <div class="fill scroll rail-gutter">
                                <RailTodos @open="loadTodo" />
                            </div>
                        </template>
                    </template>
                    <template #subagents>
                        <p class="pane-note">
                            A subagent is a short job this agent hands off inside its own session. It answers only to this agent
                            and you can't send it messages. Helper agents are different: separate agents with their own environment, listed
                            under Helpers.
                        </p>
                        <template v-if="!subagents.length">
                            <EmptyState :title="`No subagents yet`">The jobs this agent hands off show here.</EmptyState>
                        </template>
                        <div class="fill scroll">
                            <template v-for="row in subagents" :key="row.session">
                                <ListRow
                                    :kind="row.running ? 'Working' : 'Closed'"
                                    :title="row.task || row.session"
                                    :text="row.type || row.model || ''"
                                >
                                    <template #end>
                                        <Btn small @click="emit('open-subagent', row.session)">Open</Btn>
                                    </template>
                                </ListRow>
                            </template>
                        </div>
                    </template>
                    <template #skills>
                        <p class="pane-note">{{ skills.length }} skills are loaded in this agent's current context.</p>
                        <div class="fill scroll padded skill-names">
                            <template v-for="name in skills" :key="name">
                                <span class="skill-name">{{ name }}</span>
                            </template>
                            <Btn kind="text" class="skill-link" @click="openSkills">Open the Skills page</Btn>
                        </div>
                    </template>
                    <template #hooks>
                        <div class="fill scroll padded">
                            <AgentHooks :provider="provider" />
                        </div>
                    </template>
                    <template #plan>
                        <template v-if="planRow">
                            <div class="fill scroll padded">
                                <PlanPage :resource="planRow" :closable="false" />
                            </div>
                        </template>
                        <template v-else>
                            <EmptyState loading shape="text" />
                        </template>
                    </template>
                </SwitchCase>
            </template>
        </AgentPanes>
    </div>
</template>

<style scoped>
.agent-inspector {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.agent-inspector :deep(.thread) {
    --home-gutter: 24px;
    padding: 0 var(--home-gutter);
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

.rail-gutter {
    --rail-gutter: 16px;
}

.pane-note {
    flex: none;
    margin: 0;
    padding: 6px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

.skill-names {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 6px;
}

.skill-name {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-2);
    font-size: 12px;
}

.skill-link {
    flex-basis: 100%;
    margin-top: 8px;
    color: var(--accent-text);
    font-size: 12.5px;
}

.inspector-link {
    color: var(--accent-text);
    font-size: 12px;
}
</style>
