<script setup>
import {computed, onUnmounted, ref} from "vue";
import {appoint, onlineAgents} from "../api.js";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {agent, detach, span, store} from "../store.js";

const props = defineProps({standalone: Boolean});
const open = ref("");
const alone = computed(() => props.standalone || window.parent !== window || new URLSearchParams(location.search).has("chat"));
const data = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data : null));
const family = computed(() => ((data.value && data.value.model) || "").match(/opus|sonnet|haiku|gpt[-\w.]*/i));
const name = computed(() => ({claude: "Claude Code", codex: "Codex"})[data.value && data.value.provider] || "agent");
const skills = computed(() => (data.value && data.value.skills) || []);
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
const available = ref([]);
const assigning = ref("");
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
                <template v-if="family">
                    <span class="agent-fact" :title="data.model">
                        <Icon name="model" />
                        {{ family[0].toLowerCase() }}
                    </span>
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
                <span class="agent-fact agent-context" :title="`context ${Math.round(Number(data.context || 0))}% full`">
                    <span class="agent-context-bar"><span :style="{width: `${Math.round(Number(data.context || 0))}%`}" /></span>
                    {{ Math.round(Number(data.context || 0)) }}%
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
                :class="['agent-fact', 'agent-count', {none: !c.n, open: open === c.key}]"
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
                <SwitchCase :value="open">
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
                    <template #shells>
                        <p class="bar-none">{{ data.shells || 0 }} background shell(s) were started in this session.</p>
                    </template>
                    <template #default>
                        <p class="bar-none">{{ data.subagents || 0 }} subagent(s) were dispatched in this session.</p>
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
    width: 44px;
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
    margin-left: 2px;
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
</style>
