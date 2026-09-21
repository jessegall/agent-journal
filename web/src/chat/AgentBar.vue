<script setup>
import {chatOnly, framed} from "../platform/view.js";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {modelFamily, pendingChoice, providerName} from "../agents.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import CrewList from "./CrewList.vue";
import AgentAppoint from "./AgentAppoint.vue";
import AgentControls from "./AgentControls.vue";
import AgentUsage from "./AgentUsage.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import "./drop.css";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {span} from "../format/time.js";
import {detach} from "../platform/extension.js";
import {agent, store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";
import {useOutside} from "../composables/outside.js";

usePoll(...polled.agents);

const props = defineProps({standalone: Boolean});
const open = ref("");
const alone = computed(() => props.standalone || framed || chatOnly);
const data = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data : null));
const family = computed(() => modelFamily(data.value && data.value.model));
const name = computed(() => providerName(data.value && data.value.provider));
const skills = computed(() => (data.value && data.value.skills) || []);
const usage = computed(() => (data.value && data.value.usage && data.value.usage.windows) || []);
const used = (window) => Math.max(0, Math.min(100, Number(window.used ?? 100 - window.remaining)));
const usageLabel = computed(() => (usage.value.length ? `${Math.round(used(usage.value[0]))}%` : "usage"));
const filled = computed(() => Math.round(Number((data.value && data.value.context) || 0)));
const live = (rows) => (rows || []).filter((r) => r.running).length;
const counts = computed(() => [
    {
        key: "skills",
        icon: "book",
        n: skills.value.length,
        title: skills.value.length ? `${skills.value.length} skill(s) loaded in this window` : "No journal skill is loaded in this window",
        rows: skills.value,
    },
    {key: "shells", icon: "terminal", n: live(data.value && data.value.shell_rows), title: "background shells running now", rows: []},
    {key: "subagents", icon: "agents", n: live(data.value && data.value.subagent_rows), title: "subagents running now", rows: []},
]);
const skillCount = computed(() => counts.value[0]);
const activityCounts = computed(() => counts.value.slice(1));

function openSession(row) {
    open.value = "";
    peek("agent", agent.value.n, 0, row.session);
}
const anchor = ref({left: 0, top: 0});
function toggle(key, e) {
    open.value = open.value === key ? "" : key;
    const box = e.currentTarget.getBoundingClientRect();
    const wrap = bar.value.getBoundingClientRect();
    anchor.value = {left: Math.max(0, Math.min(box.left - wrap.left, wrap.width - 288)), top: box.bottom - wrap.top + 6};
}
const CONTROLS = ["model", "effort", "context"];
const DETAIL = {
    replies: "Replies only",
    info: "Replies and info",
    corrections: "Replies, info and corrections",
    discoveries: "Everything, discoveries too",
};
const SHORT = {replies: "replies", info: "info", corrections: "corrections", discoveries: "all"};
const tagging = computed(() => (store.settings && store.settings.tags) || {});
const detail = computed(() => tagging.value.verbosity || "replies");
const details = computed(() => Object.entries(DETAIL).map(([value, label]) => ({value, label, current: value === detail.value})));
async function chooseDetail(level) {
    const {names, places} = tagging.value;
    store.settings = await api.saveSettings({tags: {names, places, verbosity: level}});
    open.value = "";
}
const pending = (key) => pendingChoice(data.value, key);
const appointments = (e) => toggle("appoint", e);
const modelControls = (e, key) => toggle(key, e);
const usageDetails = (e) => toggle("usage", e);
const bar = ref(null);
function openSkills() {
    open.value = "";
    go(route.value.env, "skills");
}
useOutside(bar, () => (open.value = ""));
</script>

<template>
    <div ref="bar" class="agent-bar">
        <div class="agent-facts">
            <template v-if="!data">
                <button type="button" class="agent-fact-lead" :aria-expanded="open === 'appoint'" @click="appointments">
                    <Icon name="agents" />
                    Assign agent
                </button>
            </template>
            <template v-else>
                <button
                    type="button"
                    class="agent-fact-lead"
                    :title="`Open the agent's page — session ${agent.title}`"
                    @click="peek('agent', agent.n)"
                >
                    <Icon name="agents" />
                    {{ name }}
                </button>
                <template v-if="['claude', 'codex'].includes(data.provider)">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', 'agent-usage', {open: open === 'usage'}]"
                        :title="usage.length ? `${usageLabel} plan allowance used` : `Open ${name} usage`"
                        :aria-expanded="open === 'usage'"
                        @click="usageDetails"
                    >
                        <Icon name="activity" />
                        <template v-if="usage.length">
                            <span class="usage-gauge"><span :style="{width: `${used(usage[0])}%`}" /></span>
                        </template>
                        {{ usageLabel }}
                    </button>
                </template>
                <button
                    type="button"
                    :class="['agent-fact', 'agent-count', 'agent-context', {open: open === 'context', waiting: pending('context')}]"
                    :title="
                        pending('context')
                            ? `${pending('context')} — waiting for the agent`
                            : `context ${filled}% full — clear or compact it`
                    "
                    :aria-expanded="open === 'context'"
                    @click="modelControls($event, 'context')"
                >
                    <Icon name="gauge" />
                    <span class="agent-context-bar"><span :style="{width: `${filled}%`}" /></span>
                    {{ filled }}%
                    <template v-if="pending('context')">
                        <Spinner />
                    </template>
                </button>
                <template v-if="family">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', {open: open === 'model', waiting: pending('model')}]"
                        :title="pending('model') ? `${pending('model')} — waiting for the agent` : `${data.model} — change model`"
                        :aria-expanded="open === 'model'"
                        @click="modelControls($event, 'model')"
                    >
                        <Icon name="model" />
                        {{ pending("model") || family }}
                        <template v-if="pending('model')">
                            <Spinner />
                        </template>
                    </button>
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', {open: open === 'effort', waiting: pending('effort')}]"
                        :title="
                            pending('effort')
                                ? `effort ${pending('effort')} — waiting for the agent`
                                : `reasoning effort${data.effort ? ` ${data.effort}` : ''} — change it`
                        "
                        :aria-expanded="open === 'effort'"
                        @click="modelControls($event, 'effort')"
                    >
                        <Icon name="bolt" />
                        {{ pending("effort") || data.effort || "effort" }}
                        <template v-if="pending('effort')">
                            <Spinner />
                        </template>
                    </button>
                </template>
                <button
                    type="button"
                    :class="['agent-fact', 'agent-count', {open: open === 'detail'}]"
                    :title="`What the agent's tagged messages show in the chat: ${DETAIL[detail].toLowerCase()}`"
                    :aria-expanded="open === 'detail'"
                    @click="toggle('detail', $event)"
                >
                    <Icon name="bubble" />
                    {{ SHORT[detail] }}
                </button>
                <button
                    type="button"
                    :class="['agent-fact', 'agent-count', 'agent-skill', {none: !skillCount.n, open: open === skillCount.key}]"
                    :title="skillCount.title"
                    :aria-expanded="open === skillCount.key"
                    @click="toggle(skillCount.key, $event)"
                >
                    <Icon :name="skillCount.icon" />
                    {{ skillCount.n }}
                </button>
                <span class="agent-fact" title="how long this session has run">
                    <Icon name="reminders" />
                    {{ data.started ? span(Date.now() / 1000 - data.started) : "just started" }}
                </span>
                <template v-if="data.branch && data.branch_url">
                    <a
                        class="agent-fact agent-link"
                        :href="data.branch_url"
                        target="_blank"
                        title="the branch it works on — open it in the repository"
                    >
                        <Icon name="branch" />
                        {{ data.branch }}
                    </a>
                </template>
                <template v-else-if="data.branch">
                    <span class="agent-fact" title="the branch it works on">
                        <Icon name="branch" />
                        {{ data.branch }}
                    </span>
                </template>
            </template>
        </div>
        <template v-if="data">
            <div class="agent-actions">
                <template v-for="c in activityCounts" :key="c.key">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', `agent-activity-${c.key}`, {none: !c.n, open: open === c.key}]"
                        :title="c.title"
                        :aria-expanded="open === c.key"
                        @click="toggle(c.key, $event)"
                    >
                        <Icon :name="c.icon" />
                        {{ c.n }}
                    </button>
                </template>
                <template v-if="!alone">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', 'agent-detach', {on: store.detached}]"
                        :title="store.detached ? 'Put the chat back on the page' : 'Detach the chat into its own window'"
                        :aria-pressed="store.detached"
                        @click="detach(!store.detached)"
                    >
                        <Icon name="sidepanel" />
                    </button>
                </template>
            </div>
        </template>
        <Transition name="drop">
            <div v-if="open && (data || open === 'appoint')" class="bar-drop" :style="{left: `${anchor.left}px`, top: `${anchor.top}px`}">
                <SwitchCase :value="CONTROLS.includes(open) ? 'model' : open">
                    <template #appoint>
                        <AgentAppoint @done="open = ''" />
                    </template>
                    <template #skills>
                        <p class="bar-none">Loaded in this window, newest last. A compaction empties it.</p>
                        <template v-if="!skills.length">
                            <p class="bar-none">None — the agent is working from memory.</p>
                        </template>
                        <template v-for="s in skills" :key="s">
                            <span class="bar-item">
                                <Icon name="book" />
                                {{ s }}
                            </span>
                        </template>
                        <div class="bar-foot">
                            <button type="button" class="bar-act" @click="openSkills">Browse every skill</button>
                        </div>
                    </template>
                    <template #model>
                        <AgentControls :control="open" :agent="agent" @done="open = ''" />
                    </template>
                    <template #detail>
                        <p class="bar-current">What reaches the chat</p>
                        <p class="bar-none">The agent's tagged messages shown here besides its replies</p>
                        <ChoiceList :choices="details" @pick="chooseDetail" />
                    </template>
                    <template #usage>
                        <AgentUsage :usage="usage" />
                    </template>
                    <template #shells>
                        <CrewList :rows="data.shell_rows || []" :total="data.shells || 0" />
                    </template>
                    <template #default>
                        <CrewList :rows="data.subagent_rows || []" :total="data.subagents || 0" started="dispatched" @open="openSession" />
                    </template>
                </SwitchCase>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.agent-bar {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 34px;
    padding: 0 16px;
    font-size: 11.5px;
    color: var(--text-3);
    border-bottom: 1px solid var(--border);
    background: #111215;
}

.agent-facts {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    overflow-x: auto;
}

.agent-actions {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
    padding-left: 8px;
    border-left: 1px solid var(--border);
}

.agent-facts > * {
    flex: none;
}

.agent-fact,
.agent-fact-lead {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.agent-fact .ico,
.agent-fact-lead .ico {
    width: 12px;
    height: 12px;
    opacity: 0.65;
}

.agent-fact-lead {
    padding: 2px 6px;
    margin: 0 -6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.agent-fact-lead:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-link {
    color: inherit;
    text-decoration: none;
}

.agent-link:hover {
    color: var(--text);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.agent-context {
    gap: 7px;
    font-variant-numeric: tabular-nums;
}

.agent-context-bar {
    display: inline-block;
    width: 20px;
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
    background: var(--line);
}

.agent-context-bar > span {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--text-3);
}

.agent-count {
    padding: 0 4px;
    margin: 0 -4px;
    line-height: inherit;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    cursor: pointer;
}

.agent-count:hover,
.agent-count.open {
    background: var(--hover);
    color: var(--text);
}

.agent-count.none {
    color: var(--text-3);
}

.agent-detach {
    flex: none;
    margin-left: 8px;
    padding-left: 10px;
    border-left: 1px solid var(--border);
}

.agent-activity-subagents {
    margin-left: 8px;
}

.agent-detach.on {
    color: var(--accent-text);
}

.bar-drop {
    position: absolute;
    z-index: 30;
    width: 380px;
    max-height: 60vh;
    overflow-y: auto;
    padding: 5px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
}

.agent-usage {
    font-variant-numeric: tabular-nums;
}

.usage-gauge {
    width: 18px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.usage-gauge > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}

.agent-fact.waiting {
    color: var(--progress);
}
</style>
