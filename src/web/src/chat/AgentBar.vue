<script setup>
import {computed, inject, ref, watch} from "vue";
import {modelFamily, pendingChoice, providerName} from "../agents.js";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PresetList from "../kit/PresetList.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuSlide from "../kit/MenuSlide.vue";
import Spinner from "../kit/Spinner.vue";
import CrewList from "./CrewList.vue";
import LoopList from "./LoopList.vue";
import AgentAppoint from "./AgentAppoint.vue";
import AgentControls from "./AgentControls.vue";
import AgentUsage from "./AgentUsage.vue";
import "./drop.css";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, peek, route} from "../route.js";
import {span} from "../format/time.js";
import {agent, feedOn, store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";

usePoll(...polled.agents);

const open = ref("");
const schemesOpen = ref(false);
watch(open, () => (schemesOpen.value = false));
const data = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data : null));
const family = computed(() => modelFamily(data.value && data.value.model));
const name = computed(() => providerName(data.value && data.value.provider));
const skills = computed(() => (data.value && data.value.skills) || []);
const usage = computed(() => (data.value && data.value.usage && data.value.usage.windows) || []);
const used = (window) => Math.max(0, Math.min(100, Number(window.used ?? 100 - window.remaining)));
const usageLabel = computed(() => (usage.value.length ? `${Math.round(used(usage.value[0]))}%` : "usage"));
const filled = computed(() => Math.round(Number((data.value && data.value.context) || 0)));
const live = (rows) => (rows || []).filter((r) => r.running).length;
const PANES = [
    {key: "chat", icon: "chat", title: "Chat"},
    {key: "feed", icon: "edits", title: "File feed: the agent's edits as it makes them"},
    {key: "terminal", icon: "terminal", title: "What the agent ran lately, like a terminal"},
];
const panes = computed(() => PANES.filter((p) => p.key !== "feed" || feedOn.value));
const views = inject("views", null);
const viewGroups = computed(() =>
    ["agent", "panel"].map((key) => {
        const items = views ? views.items.value.filter((v) => v.group === key) : [];
        return {key, items, shown: items.some((v) => !v.open)};
    })
);
const counts = computed(() => [
    {
        key: "skills",
        icon: "book",
        n: skills.value.length,
        title: skills.value.length ? `${skills.value.length} skill(s) loaded in this window` : "No journal skill is loaded in this window",
        rows: skills.value,
    },
    {
        key: "shells",
        icon: "play",
        n: live(data.value && data.value.shell_rows),
        title: "Background shells: commands the agent left running in the background",
        rows: [],
    },
    {
        key: "subagents",
        icon: "agents",
        n: live(data.value && data.value.subagent_rows),
        title: "Subagents: helpers the agent dispatched",
        rows: [],
    },
    {
        key: "monitors",
        icon: "crosshair",
        n: live(data.value && data.value.monitor_rows),
        title: "Monitors: watchers the agent started, each telling it when something happens",
        rows: [],
    },
]);
const skillCount = computed(() => counts.value[0]);
const loops = computed(() => Object.keys((data.value && data.value.loops) || {}).length);

function readSkill(name) {
    store.skill = name;
    open.value = "";
}
const activityCounts = computed(() => counts.value.slice(1));

function openSession(row) {
    open.value = "";
    peek("agent", agent.value.n, 0, row.session);
}
const anchor = ref(null);
const dropHeight = Math.round(window.innerHeight * 0.6);
function toggle(key, e) {
    e.stopPropagation();
    open.value = open.value === key ? "" : key;
    anchor.value = e.currentTarget;
}
const CONTROLS = ["model", "effort", "context"];
function pickScheme(key) {
    open.value = "";
    views.scheme(key);
}

function pickPreset(key) {
    open.value = "";
    views.preset(key);
}
const pending = (key) => pendingChoice(data.value, key);
const appointments = (e) => toggle("appoint", e);
const modelControls = (e, key) => toggle(key, e);
const usageDetails = (e) => toggle("usage", e);
function openSkills() {
    open.value = "";
    go(route.value.env, "skills");
}
</script>

<template>
    <div class="agent-bar">
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
                <template v-if="loops">
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', 'agent-loops', {open: open === 'loops'}]"
                        :title="`${loops} scheduled loop${loops === 1 ? '' : 's'}: prompts the agent set to run again on a schedule`"
                        :aria-expanded="open === 'loops'"
                        @click="toggle('loops', $event)"
                    >
                        <Icon name="loop" />
                        {{ loops }}
                    </button>
                </template>
                <template v-if="data.branch && data.branch_url">
                    <a
                        class="agent-fact agent-count"
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
                <template v-if="views">
                    <template v-for="x in views.away.value" :key="x.id">
                        <button
                            type="button"
                            class="agent-away"
                            title="Open in another tab; click to bring it back here"
                            @click="views.back(x.id)"
                        >
                            <Icon name="open" :size="12" />
                            {{ x.title }} in another tab
                        </button>
                    </template>
                    <template v-for="(group, at) in viewGroups" :key="group.key">
                        <template v-if="at">
                            <span :class="['agent-divider', 'agent-views-divider', {gone: !group.shown || !viewGroups[0].shown}]" />
                        </template>
                        <div class="agent-panes">
                            <template v-for="v in group.items" :key="v.key">
                                <button
                                    type="button"
                                    :class="['agent-pane', 'agent-view', {gone: v.open, lifting: v.lifting}]"
                                    :title="`${v.title}: drag it onto a pane, or click to open it`"
                                    :tabindex="v.open ? -1 : 0"
                                    @pointerdown="views.grab($event, v.key)"
                                >
                                    <Icon :name="v.icon" />
                                </button>
                            </template>
                        </div>
                    </template>
                    <span class="agent-divider" />
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', 'agent-presets', {open: open === 'presets'}]"
                        title="Layout presets"
                        :aria-expanded="open === 'presets'"
                        @click="toggle('presets', $event)"
                    >
                        <Icon name="layout" />
                        Presets
                        <Icon name="caret" />
                    </button>
                </template>
                <template v-else>
                    <div class="agent-panes">
                        <template v-for="p in panes" :key="p.key">
                            <button
                                type="button"
                                :class="['agent-pane', {on: store.pane === p.key}]"
                                :title="p.title"
                                :aria-pressed="store.pane === p.key"
                                @click="((store.dumping = false), (store.pane = p.key))"
                            >
                                <Icon :name="p.icon" />
                            </button>
                        </template>
                    </div>
                </template>
            </div>
        </template>
        <template v-if="open && anchor && (data || open === 'appoint')">
            <MenuPanel
                :anchor="anchor"
                :min-width="open === 'presets' ? 360 : 320"
                :max-width="open === 'presets' ? 360 : 380"
                :max-height="dropHeight"
                @click.stop
                @close="open = ''"
            >
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
                            <button type="button" class="bar-item" :title="`Read the ${s} skill`" @click="readSkill(s)">
                                <Icon name="book" />
                                {{ s }}
                            </button>
                        </template>
                        <div class="bar-foot">
                            <button type="button" class="bar-act" @click="openSkills">Browse every skill</button>
                        </div>
                    </template>
                    <template #model>
                        <AgentControls :control="open" :agent="agent" @done="open = ''" />
                    </template>
                    <template #presets>
                        <MenuSlide :second="schemesOpen">
                            <template #first>
                                <PresetList
                                    :presets="views.presets.value"
                                    savable
                                    @pick="pickPreset"
                                    @save="views.saveLayout"
                                    @rename="views.renamePreset"
                                    @update="views.updatePreset"
                                    @remove="views.removePreset"
                                    @share="views.sharePreset"
                                    @import="views.importPreset"
                                />
                                <span class="bar-line" />
                                <MenuItem @click="schemesOpen = true">
                                    <Icon name="palette" :size="14" />
                                    Colour schemes
                                    <span class="bar-more">›</span>
                                </MenuItem>
                            </template>
                            <template #second>
                                <MenuItem class="bar-back" @click="schemesOpen = false">
                                    <Icon name="back" :size="14" />
                                    Colour schemes
                                </MenuItem>
                                <ChoiceList :choices="views.schemes.value" @pick="pickScheme" />
                            </template>
                        </MenuSlide>
                    </template>
                    <template #usage>
                        <AgentUsage :usage="usage" />
                    </template>
                    <template #loops>
                        <LoopList :loops="data.loops" />
                    </template>
                    <template #monitors>
                        <CrewList
                            heading="Monitors"
                            :agent="agent ? agent.n : 0"
                            :rows="data.monitor_rows || []"
                            :total="data.monitors || 0"
                        />
                    </template>
                    <template #shells>
                        <CrewList
                            heading="Background shells"
                            :agent="agent ? agent.n : 0"
                            :rows="data.shell_rows || []"
                            :total="data.shells || 0"
                        />
                    </template>
                    <template #default>
                        <CrewList
                            heading="Subagents"
                            :agent="agent ? agent.n : 0"
                            :rows="data.subagent_rows || []"
                            :total="data.subagents || 0"
                            started="dispatched"
                            @open="openSession"
                        />
                    </template>
                </SwitchCase>
            </MenuPanel>
        </template>
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
    padding: 0 14px 0 8px;
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

.agent-facts > .agent-fact-lead:first-child {
    position: sticky;
    z-index: 1;
    left: 0;
    margin-left: 0;
    background: #111215;
    box-shadow: 8px 0 8px -6px #111215;
}

.agent-fact-lead:hover {
    background: var(--hover);
    color: var(--text);
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

.agent-count:hover .ico,
.agent-count.open .ico {
    opacity: 1;
}

.agent-count.none {
    color: var(--text-3);
}

.agent-actions .agent-count {
    height: 24px;
    margin: 0;
    padding: 0 7px;
}

.agent-actions .agent-presets {
    gap: 5px;
    padding-right: 2px;
}

.agent-divider {
    width: 1px;
    height: 14px;
    margin: 0 4px;
    background: var(--border-2);
}

.agent-panes {
    display: flex;
    gap: 2px;
}

.agent-pane {
    display: grid;
    place-items: center;
    width: 26px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    transition:
        background 0.15s,
        color 0.15s;
}

.agent-pane :deep(.ico) {
    color: inherit;
}

.agent-pane:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-pane.on {
    background: var(--sel);
    color: var(--text);
}

.agent-view {
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    transition:
        width 0.24s var(--ease),
        margin 0.24s var(--ease),
        opacity 0.2s ease,
        transform 0.24s var(--ease),
        background 0.15s,
        color 0.15s;
}

.agent-view.gone {
    width: 0;
    margin-left: -2px;
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
}

.agent-view.lifting {
    opacity: 0.35;
}

.agent-away {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    margin-right: 4px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.agent-away :deep(.ico) {
    color: inherit;
}

.agent-away:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-views-divider {
    transition:
        opacity 0.2s ease,
        width 0.24s var(--ease),
        margin 0.24s var(--ease);
}

.agent-views-divider.gone {
    width: 0;
    margin: 0 -1px;
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .agent-view,
    .agent-views-divider {
        transition: none;
    }
}

.bar-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}

.bar-more {
    margin-left: auto;
    color: var(--text-4);
}

.bar-back {
    color: var(--text-3);
}

.bar-foot {
    position: sticky;
    bottom: -6px;
    margin: 4px -6px -6px;
    padding: 6px 6px 6px;
    border-top: 1px solid var(--line);
    background: var(--raised);
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
