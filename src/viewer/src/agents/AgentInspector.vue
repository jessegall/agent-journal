<script setup>
import {computed, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import ListRow from "../kit/ListRow.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import FileFeed from "../chat/FileFeed.vue";
import TerminalWindow from "../chat/TerminalWindow.vue";
import Thread from "../chat/Thread.vue";
import RailTodos from "../rail/RailTodos.vue";
import TranscriptLog from "../resource/TranscriptLog.vue";
import AgentInspectorBands from "./AgentInspectorBands.vue";
import AgentInspectorHead from "./AgentInspectorHead.vue";
import AgentTodo from "./AgentTodo.vue";
import LayoutPicker from "./LayoutPicker.vue";
import AgentPanes from "./AgentPanes.vue";
import {scopeIn} from "../composables/scope.js";
import {useTranscript} from "../composables/transcript.js";
import {INSPECTOR_FEED, INSPECTOR_PRESETS} from "../domain/panes.js";
import {levelOf} from "../domain/verbosity.js";
import {agentOf} from "../domain/agents.js";
import {useInspectorActions} from "../composables/inspectorActions.js";
import {usePoll} from "../composables/poll.js";
import {holding, rows} from "../sync/rows.js";
import {go, route} from "../route.js";

const props = defineProps({
    info: {type: Object, required: true},
    env: {type: String, default: ""},
    agent: {type: Object, default: null},
    subagents: {type: Array, default: () => []},
    skills: {type: Array, default: () => []},
    run: {type: Function, default: async () => {}},
});
const emit = defineEmits(["back", "close", "open-subagent"]);
const CHAT_TABLES = ["messages", "questions", "reactions", "notices"];
const VIEWS = {
    chat: {title: "Chat", icon: "chat"},
    terminal: {title: "Terminal", icon: "terminal"},
    transcript: {title: "Transcript", icon: "list"},
    feed: {title: "Files changed", icon: "edits"},
    tasks: {title: "Tasks", icon: "todos"},
    subagents: {
        title: "Subagents",
        icon: "agents",
    },
    skills: {title: "Skills", icon: "book"},
};

const elsewhere = Boolean(props.env) && props.env !== route.value.env;
const scope = elsewhere ? scopeIn(props.env) : null;
if (scope) provide("scope", scope);
const there = scope ? scope.api : api;
const rowsHere = scope ? scope.rows : rows;

const panes = ref(null);
const shown = (...views) => views.some((view) => (panes.value ? panes.value.shown : []).includes(view));
const refreshers = [];

const found = ref(null);
const looked = ref(false);
usePoll("inspector.agents", {
    params: () => ({client: there}),
    take: (got) => {
        looked.value = true;
        found.value = agentOf(got.rows, "", true);
    },
    active: () => !props.agent && Boolean(elsewhere),
});
const agent = computed(() => props.agent || found.value);
const sequence = computed(() => agent.value?.sequence);
const sequenceHistory = computed(() => agent.value?.sequence_history || []);


const rowViews = () => shown("chat", "tasks");
refreshers.push([
    rowViews,
    scope ? usePoll("inspector.rows", {params: () => ({scope, tables: CHAT_TABLES}), active: rowViews}) : () => {},
]);

const log = ref(null);
const scroller = computed(() => log.value && log.value.scroller);
const transcriptViews = () => shown("transcript");
const transcript = useTranscript(() => (agent.value ? agent.value.id : 0), "", scroller, there, transcriptViews);
refreshers.push([transcriptViews, transcript.refresh]);
watch(
    () => (panes.value ? panes.value.shown.join() : ""),
    () => refreshers.forEach(([wanted, refresh]) => wanted() && refresh())
);
const {turns} = transcript;

const AVAILABLE = ["chat", "transcript", "terminal", "feed", "tasks", "subagents", "skills"];

const taskId = ref(0);
const task = computed(() => rowsHere("tasks").find((row) => row.id === taskId.value) || null);
async function loadTask(id) {
    taskId.value = id;
    await (scope ? scope.holding : holding)("tasks", [id]);
}
const stateKey = computed(() => props.info.state.key);
const counts = computed(() => props.info.counts);
const link = computed(() => props.info.link);
const {asking, refusal, question, actionOf, perform, choose} = useInspectorActions(() => props.info.actions, (key, answer) => props.run(key, answer));

const sequenceBusy = ref("");
const SEQUENCE_ACTIONS = {skip: (n) => there.skipSequenceStep(n), end: (n) => there.endSequence(n)};

async function onSequence(key) {
    refusal.value = "";
    sequenceBusy.value = key;
    try {
        await SEQUENCE_ACTIONS[key](agent.value.id);
    } catch (e) {
        refusal.value = e.message;
    } finally {
        sequenceBusy.value = "";
    }
}

const showing = (view) => panes.value && panes.value.show(view);
const openSkills = () => go("skills");
</script>

<template>
    <div class="agent-inspector">
        <AgentInspectorHead :info="info" :asking="asking" @action="choose" @back="emit('back')" @close="emit('close')">
            <template #menu>
                <slot name="tools" />
            </template>
            <template #tools>
                <slot name="tools" />
                <LayoutPicker
                    :presets="INSPECTOR_PRESETS"
                    :layout="panes ? panes.layout : null"
                    tip="How the panes are laid out. It applies to every agent's inspector."
                    @pick="(shape) => panes.shape(shape)"
                />
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
        <AgentInspectorBands
            :confirm="question && question.confirm"
            :refusal="refusal"
            :state-key="stateKey"
                        :resume="actionOf('resume')"
            :sequence="sequence"
            :sequence-history="sequenceHistory"
            :sequence-busy="sequenceBusy"
            @cancel="asking = ''"
            @confirmed="(answer) => perform(question.key, answer)"
            @resume="choose('resume')"
            @skip-step="onSequence('skip')"
            @end-sequence="onSequence('end')"
        />
        <slot name="bands" />
        <AgentPanes ref="panes" :views="VIEWS" :available="AVAILABLE" :flushable="['feed']">
            <template #view="{view, pane, tune}">
                <SwitchCase :value="view">
                    <template #chat>
                        <Thread view="chat" />
                    </template>
                    <template #transcript>
                        <TranscriptLog ref="log" class="fill" :transcript="transcript" :entries="turns" :env="env" />
                    </template>
                    <template #terminal>
                        <template v-if="agent">
                            <TerminalWindow :key="`${agent.id}:${levelOf(pane)}`" class="fill" :agent="agent" :level="levelOf(pane)" />
                        </template>
                        <template v-else>
                            <EmptyState :loading="!looked" title="No agent yet">Its terminal shows here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #feed>
                        <template v-if="agent">
                            <FileFeed
                                :key="agent.id"
                                :agent="agent.id"
                                :flush="!!pane.flush"
                                :options="pane.feed || null"
                                :defaults="INSPECTOR_FEED"
                                @options="(feed) => tune({feed})"
                            />
                        </template>
                        <template v-else>
                            <EmptyState :loading="!looked" title="No agent yet">Its edits show here once the agent starts.</EmptyState>
                        </template>
                    </template>
                    <template #tasks>
                        <template v-if="task">
                            <AgentTodo :resource="task" @close="taskId = 0" />
                        </template>
                        <template v-else>
                            <div class="fill scroll rail-gutter">
                                <RailTodos finished @open="loadTask" />
                            </div>
                        </template>
                    </template>
                    <template #subagents>
                        <p class="pane-note">
                            A subagent is a short job this agent hands off inside its own session. It answers only to this agent and you
                            can't send it messages. Workers are different: separate agents with a working copy of their own, listed under
                            Workers.
                        </p>
                        <template v-if="!subagents.length">
                            <EmptyState :title="`No subagents yet`">Subagents this agent starts show here.</EmptyState>
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
