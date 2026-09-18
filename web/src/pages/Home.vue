<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {route} from "../route.js";
import {age, agent, open} from "../store.js";
import Thread from "../chat/Thread.vue";
import Notice from "../chat/Notice.vue";
import RailWaiting from "./RailWaiting.vue";
import RailTodos from "./RailTodos.vue";
import RailNotes from "./RailNotes.vue";

const tab = ref("waiting");
const notices = computed(() => open("notice"));
const agentLine = computed(() => {
    if (!agent.value || agent.value.data.status === "stopped") return [];
    const a = agent.value.data;
    const since = a.started ? age(a.started) : "";
    return [
        {icon: "agents", value: `${a.model || a.provider || "agent"} · ${agent.value.title.slice(0, 8)}`, lead: true},
        {icon: "reminders", value: since && since !== "now" ? `${since} up` : "just started"},
        {icon: "tools", value: `${a.uses || 0} tool uses`},
        {bar: Number(a.context || 0), value: `${a.context || 0}%`},
    ];
});
</script>

<template>
    <div class="home">
        <div class="home-main">
            <section class="home-section home-thread">
                <div class="agent-bar">
                    <div class="agent-facts">
                        <template v-for="f in agentLine" :key="f.value">
                            <template v-if="f.bar !== undefined">
                                <span class="agent-fact agent-context" :title="`context ${f.value} full`">
                                    <span class="agent-context-bar"><span :style="{width: `${f.bar}%`}" /></span>
                                    {{ f.value }}
                                </span>
                            </template>
                            <template v-else>
                                <span :class="f.lead ? 'agent-fact-lead' : 'agent-fact'">
                                    <Icon :name="f.icon" />
                                    {{ f.value }}
                                </span>
                            </template>
                        </template>
                        <template v-if="!agentLine.length">
                            <span class="agent-fact">No agent</span>
                        </template>
                    </div>
                </div>
                <template v-for="x in notices" :key="x.n">
                    <Notice :notice="x" />
                </template>
                <Thread />
            </section>
            <div class="home-divider" role="separator" aria-orientation="vertical" />
            <div class="home-rail">
                <div class="rail-tabs" role="tablist">
                    <template
                        v-for="[key, label, n] in [
                            ['waiting', 'Waiting on you'],
                            ['todos', 'To-dos'],
                            ['notes', 'Notifications'],
                        ]"
                        :key="key"
                    >
                        <button
                            type="button"
                            role="tab"
                            :aria-selected="tab === key"
                            :class="['rail-tab', {on: tab === key}]"
                            @click="tab = key"
                        >
                            {{ label }}
                        </button>
                    </template>
                </div>
                <SwitchCase :value="tab">
                    <template #todos><RailTodos /></template>
                    <template #notes><RailNotes /></template>
                    <template #default><RailWaiting /></template>
                </SwitchCase>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.home-main {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: stretch;
}

.home-thread {
    --home-gutter: 24px;
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    max-width: 1080px;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.home-thread > :deep(.thread) {
    padding: 0 var(--home-gutter);
}

.agent-bar {
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

.home-divider {
    flex: none;
    width: 5px;
    margin: 0 -2px;
    cursor: col-resize;
    background: transparent;
    z-index: 3;
}

.home-rail {
    --rail-gutter: 14px;
    flex: none;
    width: clamp(288px, 27%, 400px);
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-left: 1px solid var(--border);
}

.rail-tabs {
    position: sticky;
    top: 0;
    z-index: 2;
    flex: none;
    display: flex;
    align-items: stretch;
    height: 34px;
    padding: 0 var(--rail-gutter);
    gap: 14px;
    border-bottom: 1px solid var(--border);
    background: #111215;
}

.rail-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
}

.rail-tab:hover {
    color: var(--text-2);
}

.rail-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}
</style>
