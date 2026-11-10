<script setup>
import {computed, ref, toRef} from "vue";
import AgentSkillsMenu from "./AgentSkillsMenu.vue";
import AllowanceBar from "./AllowanceBar.vue";
import DashboardBadge from "../kit/DashboardBadge.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {useAgentControls} from "../composables/agentControls.js";
import {compactionLine} from "../domain/compaction.js";

// the one line under the agent bar: who the agent is, its state, the plan's allowance used, how full its context is, its model and cost, its scheduled jobs, and last how fit and how loaded it is; a window has no place here, only what opens a dropdown
const props = defineProps({
    agent: {type: Object, default: null},
    card: Boolean,
    controlGroups: {type: Array, default: () => []},
    agentPrograms: {type: Array, default: () => []},
    skills: {type: Array, default: () => []},
    loading: Boolean,
    jobs: {type: Number, default: 0},
    usage: {type: Object, default: () => ({agents: [], windows: []})},
    branch: {type: String, default: ""},
    fitness: {type: Object, default: null},
    run: {type: Function, default: null},
});
const emit = defineEmits(["open", "changed", "skills"]);
const controls = useAgentControls(toRef(props, "agent"), props.run ?? (async () => ({ok: false, error: "nothing to ask"})), () => emit("changed"), {groups: toRef(props, "controlGroups"), programs: toRef(props, "agentPrograms")});
const anchor = ref(null);
const opened = ref("");
const group = computed(() => controls.groups.value.find((one) => one.key === opened.value));

function openMenu(event, key) {
    anchor.value = event.currentTarget;
    opened.value = key;
}

function closeMenu() {
    anchor.value = null;
    opened.value = "";
    controls.asking.value = false;
}

const skillsRead = computed(() => props.skills.filter((row) => row.state === "loaded"));
function openSkills(event) {
    openMenu(event, "skills");
    emit("skills");
}

const offers = (key) => controls.groups.value.some((one) => one.key === key);
const model = computed(() => controls.chosen.value.model ?? status.value?.model ?? "");
const effort = computed(() => controls.chosen.value.effort ?? status.value?.effort ?? "");
const LOW_FITNESS = 75;
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const status = computed(() => props.usage.agents?.find((row) => row.id === props.agent?.id) ?? null);
const context = computed(() => (status.value?.context_percent == null ? null : Math.round(status.value.context_percent)));
const tokensWord = (tokens) => `${Math.round(tokens / 1000)}k`;
// the tokens the agent's context holds out of its maximum, as the usage read gives them: the limit while one caps it, otherwise the model's window
const capped = computed(() => Boolean(status.value?.context_limit_tokens));
const maximumTokens = computed(() => status.value?.context_limit_tokens || status.value?.context_window_tokens || 0);
const tokensLine = computed(() => (maximumTokens.value ? `${tokensWord(status.value.context_tokens ?? 0)} of ${tokensWord(maximumTokens.value)}` : ""));
const cost = computed(() => (status.value?.cost_dollars ? `$${status.value.cost_dollars.toFixed(2)}` : ""));
</script>

<template>
    <div :class="['information', {card}]" data-information-bar>
        <template v-if="agent">
            <button type="button" class="fact lead" :disabled="card" data-fact="agent" :title="`Session ${agent.session}: stop it`" @click="openMenu($event, 'agent')"><Icon name="agents" :size="12" /> {{ agentPrograms.find((program) => program.name === agent.program)?.title || agent.program }}</button>
            <AllowanceBar :windows="usage.windows" :disabled="card" @open="(anchor) => emit('open', 'usage', anchor)" />
            <template v-if="context !== null">
                <button type="button" class="fact" :disabled="card" data-fact="context" :title="`Context ${context}% full: clear or compact it`" @click="offers('context') ? openMenu($event, 'context') : emit('open', 'context', $event.currentTarget)">
                    <Icon name="gauge" :size="12" /> <span class="gauge"><span :style="{width: `${context}%`}" /></span> {{ context }}%
                </button>
            </template>
            <template v-if="model">
                <button type="button" class="fact" :disabled="card" data-fact="model" :title="`${model}: change the model`" @click="offers('model') ? openMenu($event, 'model') : null"><Icon name="model" :size="12" /> {{ model }}</button>
            </template>
            <template v-if="offers('effort') || (card && effort)">
                <button type="button" class="fact" :disabled="card" data-fact="effort" title="Reasoning effort: change it" @click="openMenu($event, 'effort')"><Icon name="bolt" :size="12" /> {{ effort }}</button>
            </template>
            <template v-if="cost">
                <button type="button" class="fact" :disabled="card" data-fact="cost" title="The predicted API price of this session: open its breakdown" @click="emit('open', 'cost', $event.currentTarget)">{{ cost }}</button>
            </template>
            <template v-if="branch">
                <span class="fact" data-fact="branch" title="Current branch"><Icon name="branch" :size="12" /> {{ branch }}</span>
            </template>
            <template v-if="!card">
                <button type="button" :class="['fact', {none: !jobs}]" data-fact="jobs" title="Jobs the agent scheduled for itself" @click="emit('open', 'jobs', $event.currentTarget)"><Icon name="clock" :size="12" /> {{ jobs }}</button>
            </template>
            <template v-if="run">
                <button type="button" class="fact" data-fact="skills" title="View skills read by this agent" @click="openSkills"><Icon name="book" :size="12" /> {{ skillsRead.length }}</button>
            </template>
            <template v-if="fitness">
                <button type="button" :class="['fact', 'fitness-fact', {low: fitness.is_measured && fitness.score < LOW_FITNESS}]" data-fact="fitness" title="View the agent’s performance measures" @click="emit('open', 'fitness', $event.currentTarget)">
                    <Icon name="heart" :size="12" /> {{ fitness.is_measured ? fitness.score : "–" }}
                </button>
                <button type="button" :class="['fact', 'load-fact', fitness.workload_level]" data-fact="load" title="Compare incoming messages with agent replies" @click="emit('open', 'load', $event.currentTarget)"><Icon name="weight" :size="12" /> {{ fitness.workload }}</button>
            </template>
        </template>
        <template v-else-if="run && !loading">
            <button type="button" class="fact lead" data-agent-start @click="openMenu($event, 'start')"><Icon name="agents" :size="12" /> Start an agent</button>
        </template>
        <span class="space" />
        <template v-if="controls.failure.value">
            <span class="fact failure" role="alert" data-agent-failure :title="controls.failure.value">{{ controls.failure.value }}</span>
        </template>
        <slot />
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="190" @close="closeMenu">
                <template v-if="opened === 'agent'">
                    <template v-if="controls.asking.value">
                        <MenuLabel data-agent-stop-ask>Stop the agent? It stops what it is doing.</MenuLabel>
                        <MenuItem data-agent-stop-confirm @click="closeMenu(), controls.stop()">Stop it</MenuItem>
                        <MenuItem @click="controls.asking.value = false">Keep it running</MenuItem>
                    </template>
                    <template v-else>
                        <MenuItem data-agent-stop @click="controls.asking.value = true">Stop</MenuItem>
                    </template>
                </template>
                <template v-else-if="opened === 'start'">
                    <MenuLabel>Start an agent</MenuLabel>
                    <template v-for="program in controls.programs.value" :key="program.name">
                        <MenuItem :data-agent-program="program.name" @click="closeMenu(), controls.start(program)">{{ program.title }}</MenuItem>
                    </template>
                </template>
                <template v-else-if="opened === 'skills'">
                    <AgentSkillsMenu :skills="skills" @browse="closeMenu(), emit('open', 'skills', null)" />
                </template>
                <template v-else-if="group">
                    <MenuLabel>{{ group.label }}</MenuLabel>
                    <template v-if="opened === 'context'">
                        <p class="context-compaction" data-context-menu-compaction>{{ compactionLine(status?.last_compaction ?? null) }}</p>
                        <div class="context-meter" data-context-menu-meter>
                            <span class="gauge"><span :style="{width: `${context}%`}" /></span>
                            <span class="context-used">{{ context }}%</span>
                        </div>
                        <template v-if="tokensLine">
                            <p class="context-cap" data-context-menu-cap>{{ tokensLine }} <template v-if="capped"><DashboardBadge text="Capped" tone="warn" /></template></p>
                        </template>
                    </template>
                    <template v-for="choice in group.choices" :key="choice.value">
                        <MenuItem :data-agent-choice="choice.value" @click="controls.choose(group.key, choice), closeMenu()">{{ choice.label }}</MenuItem>
                    </template>
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.fitness-fact.low,
.load-fact.warn {
    color: var(--warn, var(--text-2));
}

.load-fact.critical {
    color: var(--danger);
}

.context-meter {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 2px 10px 4px;
}

.context-meter .gauge {
    flex: 1;
    width: auto;
}

.context-used {
    color: var(--text-2);
    font-size: 11.5px;
}

.context-cap {
    display: flex;
    gap: 6px;
    align-items: center;
    margin: 0;
    padding: 0 10px 6px;
    color: var(--text-2);
    font-size: 11.5px;
}

.context-compaction {
    margin: 0;
    padding: 0 10px 6px;
    color: var(--text-3);
    font-size: 11.5px;
}

.information {
    display: flex;
    gap: 16px;
    align-items: center;
    min-height: 30px;
    padding: 0 5px 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}

.information.card { flex-wrap: wrap; gap: 8px; padding: 6px 14px; }

@media (max-width: 760px) {
    .information {
        flex-wrap: wrap;
    }
}

.fact {
    display: inline-flex;
    flex: none;
    gap: 5px;
    align-items: center;
    padding: 0 4px;
    margin: 0 -4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

button.fact:disabled { cursor: default; }

button.fact:not(:disabled) {
    cursor: pointer;
}

button.fact:not(:disabled):hover {
    background: var(--hover);
    color: var(--text);
}

.fact.failure {
    max-width: 320px;
    overflow: hidden;
    color: var(--danger);
    text-overflow: ellipsis;
}

.fact.none {
    color: var(--text-3);
}

.fact.lead {
    color: var(--text);
}

.gauge {
    display: inline-block;
    width: 20px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line, var(--border));
}

.gauge > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--text-3);
}

.space {
    flex: 1;
}
</style>
