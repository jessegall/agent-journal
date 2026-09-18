<script setup>
import {computed, onUnmounted, ref} from "vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {agent, span} from "../store.js";

const open = ref("");
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
const toggle = (key) => (open.value = open.value === key ? "" : key);
const bar = ref(null);
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
                <span class="agent-fact">No agent</span>
            </template>
            <template v-else>
                <span class="agent-fact-lead" :title="`session ${agent.title}`">
                    <Icon name="agents" />
                    {{ name }}
                </span>
                <template v-if="family">
                    <span class="agent-fact" :title="data.model">
                        <Icon name="model" />
                        {{ family[0].toLowerCase() }}
                    </span>
                </template>
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
                <span class="agent-fact" title="how long this session has run">
                    <Icon name="reminders" />
                    {{ data.started ? span(Date.now() / 1000 - data.started) : "just started" }}
                </span>
                <span class="agent-fact agent-context" :title="`context ${Math.round(Number(data.context || 0))}% full`">
                    <span class="agent-context-bar"><span :style="{width: `${Math.round(Number(data.context || 0))}%`}" /></span>
                    {{ Math.round(Number(data.context || 0)) }}%
                </span>
                <template v-for="c in counts" :key="c.key">
                    <span class="agent-facts-divider" />
                    <button
                        type="button"
                        :class="['agent-fact', 'agent-count', {none: !c.n, open: open === c.key}]"
                        :title="c.title"
                        :aria-expanded="open === c.key"
                        @click="toggle(c.key)"
                    >
                        <Icon :name="c.icon" />
                        {{ c.n }}
                    </button>
                </template>
            </template>
        </div>
        <template v-if="open && data">
            <div class="bar-drop">
                <SwitchCase :value="open">
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
                    </template>
                    <template #shells>
                        <p class="bar-none">{{ data.shells || 0 }} background shell(s) were started in this session.</p>
                    </template>
                    <template #default>
                        <p class="bar-none">{{ data.subagents || 0 }} subagent(s) were dispatched in this session.</p>
                    </template>
                </SwitchCase>
            </div>
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
    color: var(--text-2);
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

.agent-facts-divider {
    align-self: stretch;
    width: 1px;
    margin: 9px 2px;
    background: var(--border);
}

.agent-count {
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
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

.bar-drop {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 30;
    max-height: 60vh;
    overflow-y: auto;
    padding: 6px 10px;
    border-bottom: 1px solid var(--border-2);
    background: var(--raised);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
}

.bar-none {
    margin: 0;
    padding: 6px 8px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
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
</style>
