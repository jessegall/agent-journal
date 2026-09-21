<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {modelFamily, providerName} from "../agents.js";
import Icon from "../kit/Icon.vue";
import Spinner from "../kit/Spinner.vue";
import CrewList from "./CrewList.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {agent, detach, polled, span, store} from "../store.js";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);

const props = defineProps({standalone: Boolean});
const open = ref("");
const alone = computed(() => props.standalone || window.parent !== window || new URLSearchParams(location.search).has("chat"));
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
const available = ref([]);
const assigning = ref("");
const controls = ref({groups: [], note: ""});
const controlling = ref("");
const error = ref("");
const anchor = ref({left: 0, top: 0});
function toggle(key, e) {
    open.value = open.value === key ? "" : key;
    const box = e.currentTarget.getBoundingClientRect();
    const wrap = bar.value.getBoundingClientRect();
    anchor.value = {left: Math.max(0, Math.min(box.left - wrap.left, wrap.width - 288)), top: box.bottom - wrap.top + 6};
}
async function appointments(e) {
    toggle("appoint", e);
    if (open.value !== "appoint") return;
    error.value = "";
    try {
        available.value = await api.onlineAgents();
    } catch (e) {
        error.value = e.message;
    }
}
const CONTROLS = ["model", "effort"];
const WAITS_FOR = 600;
const pending = (key) => {
    const choice = data.value && data.value.pending && data.value.pending[key];
    return choice && Date.now() / 1000 - choice.at < WAITS_FOR ? choice.value : "";
};
const chosen = computed(() => controls.value.groups.filter((group) => group.key === open.value));
const current = computed(() => (open.value === "effort" ? `effort ${data.value.effort || "not reported"}` : data.value.model));
async function modelControls(e, key) {
    toggle(key, e);
    if (open.value !== key) return;
    error.value = "";
    controls.value = {groups: [], note: "Loading controls…"};
    try {
        controls.value = await api.agentControls(data.value.provider, data.value.model);
    } catch (e) {
        error.value = e.message;
    }
}
async function control(action, value) {
    controlling.value = `${action}:${value}`;
    error.value = "";
    try {
        await api.controlAgent(agent.value.title, action, value);
        open.value = "";
    } catch (e) {
        error.value = e.message;
    } finally {
        controlling.value = "";
    }
}
const waiting = (key, value) => controlling.value === `${key}:${value}` || pending(key) === value;
function usageDetails(e) {
    toggle("usage", e);
    error.value = "";
}
function resetLabel(window) {
    const seconds = window.resets - Date.now() / 1000;
    return seconds > 0 ? `resets in ${span(seconds)}` : "reset due";
}
async function choose(candidate) {
    assigning.value = candidate.session;
    error.value = "";
    try {
        await api.appoint(candidate.session);
        open.value = "";
    } catch (e) {
        error.value = e.message;
    } finally {
        assigning.value = "";
    }
}
const bar = ref(null);
function openSkills() {
    open.value = "";
    go(route.value.env, "skills");
}
const away = (e) => {
    if (bar.value && !bar.value.contains(e.target)) open.value = "";
};
window.addEventListener("click", away);
onUnmounted(() => window.removeEventListener("click", away));
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
                        <template v-if="error">
                            <p class="bar-error">{{ error }}</p>
                        </template>
                        <template v-else-if="!available.length">
                            <p class="bar-none">No online agents are available.</p>
                        </template>
                        <template v-for="candidate in available" :key="candidate.session">
                            <button
                                type="button"
                                class="bar-agent-choice"
                                :disabled="assigning === candidate.session"
                                @click="choose(candidate)"
                            >
                                <Icon name="agents" />
                                <span>
                                    {{ providerName(candidate.provider, "Agent") }}{{ candidate.model ? ` · ${candidate.model}` : "" }}
                                </span>
                                <small>{{ candidate.environment || "unassigned" }}</small>
                            </button>
                        </template>
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
                        <template v-if="error">
                            <p class="bar-error">{{ error }}</p>
                        </template>
                        <p class="bar-current">{{ current }}</p>
                        <template v-if="pending(open)">
                            <div class="bar-waiting">
                                <span>{{ pending(open) }} is waiting for the agent to finish its turn.</span>
                            </div>
                        </template>
                        <template v-for="group in chosen" :key="group.key">
                            <p class="bar-label">{{ group.label }}</p>
                            <div class="bar-choices">
                                <template v-for="choice in group.choices" :key="choice.value">
                                    <button
                                        type="button"
                                        class="bar-control-choice"
                                        :disabled="Boolean(controlling)"
                                        @click="control(group.key, choice.value)"
                                    >
                                        <template v-if="waiting(group.key, choice.value)">
                                            <Spinner />
                                        </template>
                                        {{ choice.label }}
                                    </button>
                                </template>
                            </div>
                        </template>
                        <p class="bar-none">{{ controls.note }}</p>
                    </template>
                    <template #usage>
                        <template v-if="error">
                            <p class="bar-error">{{ error }}</p>
                        </template>
                        <p class="bar-current">Plan allowance used</p>
                        <template v-for="window in usage" :key="window.key">
                            <div class="bar-usage">
                                <span>{{ window.label }}</span>
                                <strong>{{ Math.round(used(window)) }}%</strong>
                                <span class="bar-usage-track"><span :style="{width: `${used(window)}%`}" /></span>
                                <small>{{ resetLabel(window) }}</small>
                            </div>
                        </template>
                        <template v-if="!usage.length && !error">
                            <p class="bar-none">No current plan window has been reported here.</p>
                        </template>
                    </template>
                    <template #context>
                        <template v-if="error">
                            <p class="bar-error">{{ error }}</p>
                        </template>
                        <p class="bar-current">Context window</p>
                        <div class="bar-usage">
                            <span>Used</span>
                            <strong>{{ filled }}%</strong>
                            <span class="bar-usage-track"><span :style="{width: `${filled}%`}" /></span>
                        </div>
                        <template v-if="pending('context')">
                            <div class="bar-waiting">
                                <span>{{ pending("context") }} is waiting for the agent to finish its turn.</span>
                            </div>
                        </template>
                        <template v-for="group in chosen" :key="group.key">
                            <div class="bar-choices">
                                <template v-for="choice in group.choices" :key="choice.value">
                                    <button
                                        type="button"
                                        class="bar-control-choice"
                                        :disabled="Boolean(controlling)"
                                        @click="control(group.key, choice.value)"
                                    >
                                        <template v-if="waiting(group.key, choice.value)">
                                            <Spinner />
                                        </template>
                                        {{ choice.label }}
                                    </button>
                                </template>
                            </div>
                        </template>
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

.bar-foot {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 4px;
    padding-top: 5px;
    border-top: 1px solid var(--border);
}

.bar-act {
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.bar-act:hover {
    background: var(--hover);
}

.bar-none {
    margin: 0;
    padding: 6px 8px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.bar-error {
    margin: 0;
    padding: 6px 8px;
    color: var(--danger);
    font-size: 11.5px;
}

.bar-current {
    margin: 0;
    padding: 7px 8px 5px;
    color: var(--text);
    font-size: 12px;
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

.bar-usage {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
    padding: 6px 8px;
    color: var(--text-2);
    font-size: 11.5px;
}

.bar-usage strong {
    color: var(--text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.bar-usage-track {
    grid-column: 1 / -1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.bar-usage-track > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}

.bar-usage small {
    grid-column: 1 / -1;
    color: var(--text-3);
    font-size: 10.5px;
}

.bar-label {
    margin: 0;
    padding: 6px 8px 3px;
    color: var(--text-3);
    font-size: 10px;
    font-weight: 650;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.bar-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 2px 6px 5px;
}

.bar-control-choice {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.bar-control-choice:hover {
    border-color: var(--border-2);
    background: var(--hover);
    color: var(--text);
}

.bar-agent-choice {
    width: 100%;
    display: grid;
    grid-template-columns: 16px 1fr auto;
    align-items: center;
    gap: 7px;
    padding: 7px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.bar-agent-choice:hover {
    background: var(--hover);
    color: var(--text);
}

.bar-agent-choice small {
    color: var(--text-3);
    font-size: 10.5px;
}

.bar-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.bar-item .ico {
    width: 13px;
    height: 13px;
}

.drop-enter-active {
    transition:
        opacity 0.16s ease-out,
        transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.drop-leave-active {
    transition:
        opacity 0.12s ease-in,
        transform 0.12s ease-in;
}

.drop-enter-from,
.drop-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.agent-fact.waiting {
    color: var(--progress);
}

.bar-waiting {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 0 8px;
    font-size: 12px;
    color: var(--progress);
}
</style>
