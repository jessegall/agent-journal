<script setup>
import {agent} from "../composables/leadAgent.js";
import {computed} from "vue";
import {demo, unlessDemo} from "../platform/demo.js";
import Spinner from "../kit/Spinner.vue";
import AgentFact from "./AgentFact.vue";
import {loadedSkills, modelFamily, pendingChoice, providerName, usageWindows} from "../domain/agents.js";
import {span} from "../format/time.js";

const props = defineProps({data: {type: Object, default: null}, open: {type: String, default: ""}});
const emit = defineEmits(["toggle"]);
const family = computed(() => modelFamily(props.data && props.data.model));
const name = computed(() => providerName(props.data && props.data.provider));
const skills = computed(() => loadedSkills(props.data));
const usage = computed(() => usageWindows(props.data));
const used = (window) => Math.max(0, Math.min(100, Number(window.used ?? 100 - window.remaining)));
const usageLabel = computed(() => (usage.value.length ? `${Math.round(used(usage.value[0]))}%` : "usage"));
const filled = computed(() => Math.round(Number((props.data && props.data.context) || 0)));
const live = (rows) => (rows || []).filter((r) => r.running).length;
const skillCount = computed(() => ({
    key: "skills",
    icon: "book",
    n: skills.value.length,
    title: skills.value.length ? `${skills.value.length} skill(s) loaded in this window` : "No journal skill is loaded in this window",
}));
const activityCounts = computed(() => [
    {
        key: "shells",
        icon: "play",
        n: live(props.data && props.data.shell_rows),
        title: "Background commands the agent left running",
    },
    {
        key: "subagents",
        icon: "agents",
        n: live(props.data && props.data.subagent_rows),
        title: "Subagents: helpers the agent dispatched",
    },
    {
        key: "monitors",
        icon: "crosshair",
        n: live(props.data && props.data.monitor_rows),
        title: "Monitors: watchers the agent started, each telling it when something happens",
    },
]);
const loops = computed(() => Object.keys((props.data && props.data.loops) || {}).length);
const pending = (key) => pendingChoice(props.data, key);
const toggle = (key, e) => emit("toggle", key, e);
</script>

<template>
    <div class="agent-facts">
        <template v-if="!data">
            <AgentFact
                class="agent-fact-lead"
                icon="agents"
                :disabled="demo"
                :title="unlessDemo('')"
                :aria-expanded="open === 'appoint'"
                @click="toggle('appoint', $event)"
            >
                Assign agent
            </AgentFact>
        </template>
        <template v-else>
            <AgentFact
                class="agent-fact-lead"
                icon="agents"
                :title="`Session ${agent.title}: open its page or stop it`"
                :aria-expanded="open === 'agent'"
                @click="toggle('agent', $event)"
            >
                {{ name }}
            </AgentFact>
            <template v-if="['claude', 'codex'].includes(data.provider)">
                <AgentFact
                    :class="['agent-fact', 'agent-count', 'agent-usage', {open: open === 'usage'}]"
                    icon="activity"
                    :title="usage.length ? `${usageLabel} plan allowance used` : `Open ${name} usage`"
                    :aria-expanded="open === 'usage'"
                    @click="toggle('usage', $event)"
                >
                    <template v-if="usage.length">
                        <span class="usage-gauge"><span :style="{width: `${used(usage[0])}%`}" /></span>
                    </template>
                    {{ usageLabel }}
                </AgentFact>
            </template>
            <AgentFact
                :class="['agent-fact', 'agent-count', 'agent-context', {open: open === 'context', waiting: pending('context')}]"
                icon="gauge"
                :title="
                    pending('context') ? `${pending('context')} — waiting for the agent` : `context ${filled}% full — clear or compact it`
                "
                :aria-expanded="open === 'context'"
                @click="toggle('context', $event)"
            >
                <span class="agent-context-bar"><span :style="{width: `${filled}%`}" /></span>
                {{ filled }}%
                <template v-if="pending('context')">
                    <Spinner />
                </template>
            </AgentFact>
            <template v-if="family">
                <AgentFact
                    :class="['agent-fact', 'agent-count', {open: open === 'model', waiting: pending('model')}]"
                    icon="model"
                    :title="pending('model') ? `${pending('model')} — waiting for the agent` : `${data.model} — change model`"
                    :aria-expanded="open === 'model'"
                    @click="toggle('model', $event)"
                >
                    {{ pending("model") || family }}
                    <template v-if="pending('model')">
                        <Spinner />
                    </template>
                </AgentFact>
                <AgentFact
                    :class="['agent-fact', 'agent-count', {open: open === 'effort', waiting: pending('effort')}]"
                    icon="bolt"
                    :title="
                        pending('effort')
                            ? `effort ${pending('effort')} — waiting for the agent`
                            : `reasoning effort${data.effort ? ` ${data.effort}` : ''} — change it`
                    "
                    :aria-expanded="open === 'effort'"
                    @click="toggle('effort', $event)"
                >
                    {{ pending("effort") || data.effort || "effort" }}
                    <template v-if="pending('effort')">
                        <Spinner />
                    </template>
                </AgentFact>
            </template>
            <AgentFact
                :class="['agent-fact', 'agent-count', 'agent-skill', {none: !skillCount.n, open: open === skillCount.key}]"
                :icon="skillCount.icon"
                :title="skillCount.title"
                :aria-expanded="open === skillCount.key"
                @click="toggle(skillCount.key, $event)"
            >
                {{ skillCount.n }}
            </AgentFact>
            <AgentFact class="agent-fact" tag="span" icon="reminders" title="how long this session has run">
                {{ data.started ? span(Date.now() / 1000 - data.started) : "just started" }}
            </AgentFact>
            <template v-for="c in activityCounts" :key="c.key">
                <AgentFact
                    :class="['agent-fact', 'agent-count', `agent-activity-${c.key}`, {none: !c.n, open: open === c.key}]"
                    :icon="c.icon"
                    :title="c.title"
                    :aria-expanded="open === c.key"
                    @click="toggle(c.key, $event)"
                >
                    {{ c.n }}
                </AgentFact>
            </template>
            <template v-if="loops">
                <AgentFact
                    :class="['agent-fact', 'agent-count', 'agent-loops', {open: open === 'loops'}]"
                    icon="loop"
                    :title="`${loops} repeating prompt${loops === 1 ? '' : 's'}: prompts the agent set to run again on a schedule`"
                    :aria-expanded="open === 'loops'"
                    @click="toggle('loops', $event)"
                >
                    {{ loops }}
                </AgentFact>
            </template>
            <template v-if="data.branch && data.branch_url">
                <AgentFact
                    class="agent-fact agent-count"
                    tag="a"
                    icon="branch"
                    :href="data.branch_url"
                    target="_blank"
                    title="the branch it works on — open it in the repository"
                >
                    {{ data.branch }}
                </AgentFact>
            </template>
            <template v-else-if="data.branch">
                <AgentFact class="agent-fact" tag="span" icon="branch" title="the branch it works on">
                    {{ data.branch }}
                </AgentFact>
            </template>
        </template>
    </div>
</template>

<style scoped>
.agent-facts {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    overflow-x: auto;
}

.agent-facts > * {
    flex: none;
}

.agent-facts > .agent-fact-lead:first-child {
    position: sticky;
    z-index: 1;
    left: 0;
    margin-left: 0;
    background: #111215;
    box-shadow: 8px 0 8px -6px #111215;
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
</style>
