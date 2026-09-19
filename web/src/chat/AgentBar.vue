<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {agentControls, agentUsage, appoint, controlAgent, forceAgent, onlineAgents} from "../api.js";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {agent, detach, span, store} from "../store.js";

const props = defineProps({standalone: Boolean});
const open = ref("");
const alone = computed(() => props.standalone || window.parent !== window || new URLSearchParams(location.search).has("chat"));
const data = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data : null));
const family = computed(() => ((data.value && data.value.model) || "").match(/opus|sonnet|haiku|fable|gpt[-\w.]*/i));
const name = computed(() => ({claude: "Claude Code", codex: "Codex"})[data.value && data.value.provider] || "agent");
const skills = computed(() => (data.value && data.value.skills) || []);
const usage = computed(() => (data.value && data.value.usage && data.value.usage.windows) || []);
const used = (window) => Math.max(0, Math.min(100, Number(window.used ?? 100 - window.remaining)));
const usageLabel = computed(() => (usage.value.length ? `${Math.round(used(usage.value[0]))}%` : "usage"));
const counts = computed(() => [
    {
        key: "skills",
        icon: "book",
        n: skills.value.length,
        title: skills.value.length ? `${skills.value.length} skill(s) loaded in this window` : "No journal skill is loaded in this window",
        rows: skills.value,
    },
    {key: "shells", icon: "terminal", n: (data.value && data.value.shells) || 0, title: "background shells started this session", rows: []},
    {key: "subagents", icon: "agents", n: (data.value && data.value.subagents) || 0, title: "subagents dispatched this session", rows: []},
]);
const skillCount = computed(() => counts.value[0]);
const activityCounts = computed(() => counts.value.slice(1));
const shellRows = computed(() => sorted((data.value && data.value.shell_rows) || []));
const subagentRows = computed(() => sorted((data.value && data.value.subagent_rows) || []));
const now = ref(Date.now() / 1000);
const clock = setInterval(() => (now.value = Date.now() / 1000), 1000);

function sorted(rows) {
    return [...rows.filter((r) => r.running), ...rows.filter((r) => !r.running).reverse()];
}

function lasted(row) {
    if (!row.at) return "";
    return row.running ? `running ${span(now.value - row.at)}` : `${row.status || "finished"} · ${span((row.ended || row.at) - row.at)}`;
}

function openSession(row) {
    open.value = "";
    peek("agent", agent.value.n, 0, row.session);
}
const available = ref([]);
const assigning = ref("");
const controls = ref({groups: [], note: ""});
const controlling = ref("");
const usageInfo = ref({note: ""});
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
        available.value = await onlineAgents();
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
        controls.value = await agentControls(data.value.provider, data.value.model);
    } catch (e) {
        error.value = e.message;
    }
}
async function control(action, value) {
    controlling.value = `${action}:${value}`;
    error.value = "";
    try {
        await controlAgent(route.value.env, agent.value.title, action, value);
        open.value = "";
    } catch (e) {
        error.value = e.message;
    } finally {
        controlling.value = "";
    }
}
const forced = ref("");
async function pushThrough() {
    forced.value = open.value;
    error.value = "";
    try {
        await forceAgent(route.value.env, agent.value.title);
    } catch (e) {
        forced.value = "";
        error.value = e.message;
    }
}
watch(
    () => pending(forced.value),
    (still) => still || (forced.value = "")
);
async function usageDetails(e) {
    toggle("usage", e);
    if (open.value !== "usage") return;
    error.value = "";
    usageInfo.value = {note: "Loading usage…"};
    try {
        usageInfo.value = await agentUsage(data.value.provider);
    } catch (e) {
        error.value = e.message;
    }
}
function resetLabel(window) {
    const seconds = window.resets - Date.now() / 1000;
    return seconds > 0 ? `resets in ${span(seconds)}` : "reset due";
}
async function choose(candidate) {
    assigning.value = candidate.session;
    error.value = "";
    try {
        await appoint(route.value.env, candidate.session);
        open.value = "";
    } catch (e) {
        error.value = e.message;
    } finally {
        assigning.value = "";
    }
}
const agentName = (provider) => ({claude: "Claude Code", codex: "Codex"})[provider] || "Agent";
const bar = ref(null);
function openSkills() {
    open.value = "";
    go(route.value.env, "skills");
}
const away = (e) => {
    if (bar.value && !bar.value.contains(e.target)) open.value = "";
};
window.addEventListener("click", away);
onUnmounted(() => {
    window.removeEventListener("click", away);
    clearInterval(clock);
});
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
                <button
                    v-if="['claude', 'codex'].includes(data.provider)"
                    type="button"
                    :class="['agent-fact', 'agent-count', 'agent-usage', {open: open === 'usage'}]"
                    :title="usage.length ? `${usageLabel} plan allowance used` : `Open ${name} usage`"
                    :aria-expanded="open === 'usage'"
                    @click="usageDetails"
                >
                    <Icon name="activity" />
                    <span v-if="usage.length" class="usage-gauge"><span :style="{width: `${used(usage[0])}%`}" /></span>
                    {{ usageLabel }}
                </button>
                <span class="agent-fact agent-context" :title="`context ${Math.round(Number(data.context || 0))}% full`">
                    <Icon name="gauge" />
                    <span class="agent-context-bar"><span :style="{width: `${Math.round(Number(data.context || 0))}%`}" /></span>
                    {{ Math.round(Number(data.context || 0)) }}%
                </span>
                <template v-if="family">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', {open: open === 'model', waiting: pending('model')}]"
                        :title="pending('model') ? `${pending('model')} — waiting for the agent` : `${data.model} — change model`"
                        :aria-expanded="open === 'model'"
                        @click="modelControls($event, 'model')"
                    >
                        <Icon name="model" />
                        {{ pending("model") || family[0].toLowerCase() }}
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
        <div v-if="data" class="agent-actions">
            <button
                v-for="c in activityCounts"
                :key="c.key"
                type="button"
                :class="['agent-fact', 'agent-count', `agent-activity-${c.key}`, {none: !c.n, open: open === c.key}]"
                :title="c.title"
                :aria-expanded="open === c.key"
                @click="toggle(c.key, $event)"
            >
                <Icon :name="c.icon" />
                {{ c.n }}
            </button>
            <button
                v-if="!alone"
                type="button"
                :class="['agent-fact', 'agent-count', 'agent-detach', {on: store.detached}]"
                :title="store.detached ? 'Put the chat back on the page' : 'Detach the chat into its own window'"
                :aria-pressed="store.detached"
                @click="detach(!store.detached)"
            >
                <Icon name="sidepanel" />
            </button>
        </div>
        <Transition name="drop">
            <div v-if="open && (data || open === 'appoint')" class="bar-drop" :style="{left: `${anchor.left}px`, top: `${anchor.top}px`}">
                <SwitchCase :value="CONTROLS.includes(open) ? 'model' : open">
                    <template #appoint>
                        <p v-if="error" class="bar-error">{{ error }}</p>
                        <p v-else-if="!available.length" class="bar-none">No online agents are available.</p>
                        <button
                            v-for="candidate in available"
                            :key="candidate.session"
                            type="button"
                            class="bar-agent-choice"
                            :disabled="assigning === candidate.session"
                            @click="choose(candidate)"
                        >
                            <Icon name="agents" />
                            <span>{{ agentName(candidate.provider) }}{{ candidate.model ? ` · ${candidate.model}` : "" }}</span>
                            <small>{{ candidate.environment || "unassigned" }}</small>
                        </button>
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
                        <p v-if="error" class="bar-error">{{ error }}</p>
                        <p class="bar-current">{{ current }}</p>
                        <div v-if="pending(open)" class="bar-waiting">
                            <span>{{ pending(open) }} is waiting for the agent to finish its turn.</span>
                            <button
                                type="button"
                                :class="['bar-act', {forcing: forced === open}]"
                                :disabled="Boolean(controlling) || forced === open"
                                @click="pushThrough"
                            >
                                {{ forced === open ? "Forcing" : "Force now" }}
                            </button>
                        </div>
                        <template v-for="group in chosen" :key="group.key">
                            <p class="bar-label">{{ group.label }}</p>
                            <div class="bar-choices">
                                <button
                                    v-for="choice in group.choices"
                                    :key="choice.value"
                                    type="button"
                                    class="bar-control-choice"
                                    :disabled="Boolean(controlling)"
                                    @click="control(group.key, choice.value)"
                                >
                                    {{ choice.label }}
                                </button>
                            </div>
                        </template>
                        <p class="bar-none">{{ controls.note }}</p>
                    </template>
                    <template #usage>
                        <p v-if="error" class="bar-error">{{ error }}</p>
                        <p class="bar-current">Plan allowance used</p>
                        <div v-for="window in usage" :key="window.key" class="bar-usage">
                            <span>{{ window.label }}</span>
                            <strong>{{ Math.round(used(window)) }}%</strong>
                            <span class="bar-usage-track"><span :style="{width: `${used(window)}%`}" /></span>
                            <small>{{ resetLabel(window) }}</small>
                        </div>
                        <p v-if="!usage.length && !error" class="bar-none">No current plan window has been reported here.</p>
                        <p class="bar-none">{{ usageInfo.note }}</p>
                    </template>
                    <template #shells>
                        <p class="bar-none">
                            {{ shellRows.filter((r) => r.running).length }} running, {{ data.shells || 0 }} started in this session.
                        </p>
                        <span v-for="row in shellRows" :key="row.id || row.cell" :class="['bar-item', 'crew-row', {done: !row.running}]">
                            <span :class="['crew-dot', {on: row.running}]" />
                            <span class="crew-what">
                                {{ row.task || row.command }}
                                <small>{{ row.task ? row.command : row.cell }}</small>
                            </span>
                            <small class="crew-when">{{ lasted(row) }}</small>
                        </span>
                    </template>
                    <template #default>
                        <p class="bar-none">
                            {{ subagentRows.filter((r) => r.running).length }} running, {{ data.subagents || 0 }} dispatched in this
                            session.
                        </p>
                        <button
                            v-for="row in subagentRows"
                            :key="row.id || `${row.task}-${row.model}`"
                            type="button"
                            :class="['bar-item', 'crew-row', {done: !row.running}]"
                            :disabled="!row.session"
                            :title="row.session ? 'Open this subagent\'s session' : ''"
                            @click="openSession(row)"
                        >
                            <span :class="['crew-dot', {on: row.running}]" />
                            <span class="crew-what">
                                {{ row.task }}
                                <small>{{ [row.type, row.model].filter(Boolean).join(" · ") }}</small>
                            </span>
                            <small class="crew-when">{{ lasted(row) }}</small>
                        </button>
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
    width: 280px;
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

.crew-row {
    width: 100%;
    border: 0;
    background: none;
    text-align: left;
}

button.crew-row:not(:disabled) {
    cursor: pointer;
}

button.crew-row:not(:disabled):hover {
    background: var(--hover);
}

.crew-row.done {
    opacity: 0.6;
}

.crew-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-3);
}

.crew-dot.on {
    background: var(--created);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--created) 25%, transparent);
}

.crew-what {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.crew-what small {
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-3);
    font-size: 11px;
}

.crew-when {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
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

.agent-fact.waiting::after {
    content: "";
    width: 7px;
    height: 7px;
    margin-left: 3px;
    border: 1.5px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: waiting 0.8s linear infinite;
}

@keyframes waiting {
    to {
        transform: rotate(360deg);
    }
}

.bar-waiting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 4px 0 8px;
    font-size: 12px;
    color: var(--progress);
}

.bar-act.forcing::after {
    content: "";
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-left: 5px;
    border: 1.5px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: waiting 0.8s linear infinite;
}
</style>
