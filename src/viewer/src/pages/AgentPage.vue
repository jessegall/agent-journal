<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import PaneStage from "../windows/PaneStage.vue";
import {followEvents} from "../windows/windowCatalogue.js";
import {startWindows} from "../windows/startup.js";
import {driverOf, useHomeLayout} from "../windows/homeLayout.js";

const PHONE_WIDTH = 700;
const props = defineProps({
    environment: {type: String, required: true},
    agent: {type: Number, required: true},
    catalogue: {type: Object, default: null},
    events: {type: Function, default: followEvents},
});

const started = startWindows(props);
const {subscriptions, shellLine, prompts, listeners, stop} = started;
const facts = ref(null);
const failure = ref("");
const narrow = ref(window.innerWidth < PHONE_WIDTH);
const measure = () => (narrow.value = window.innerWidth < PHONE_WIDTH);
const offered = computed(() => (facts.value ? started.catalogue.forAgent(facts.value.role) : started.catalogue));
const home = computed(() => facts.value && layouts(facts.value));
let kept = null;

function layouts({driver}) {
    kept ||= useHomeLayout(props.environment, shellLine, offered.value, {page: "agent", driver});
    return kept;
}

const tabbed = computed(() => {
    const layout = home.value?.store.layout.value;
    return layout ? Object.entries(layout.panes).flatMap(([id, pane]) => pane.tabs.map((name) => ({id: Number(id), name, title: offered.value.window(name)?.title || pane.titles?.[name] || name, on: pane.active === name}))) : [];
});

function show(tab) {
    home.value.store.activate(tab.id, tab.name);
}

// the agent's role comes from the agent, its driver from the suite's driver for that role
onMounted(async () => {
    window.addEventListener("resize", measure);
    const answer = await shellLine(["agent", "show", String(props.agent)]);
    if (!answer.ok) return void (failure.value = answer.error);
    const run = await shellLine(["suite", "current", props.environment]);
    const role = answer.value.role;
    facts.value = {role, driver: run.ok ? driverOf(run.value.drivers, role) || driverOf(run.value.drivers, "main") : ""};
    listeners.push(layouts(facts.value).heard);
    layouts(facts.value).load();
});
onUnmounted(() => {
    window.removeEventListener("resize", measure);
    stop();
});
</script>

<template>
    <div class="agent-page" :data-face="started.face.value">
        <template v-if="failure">
            <p class="agent-page-failure" role="alert">Agent {{ agent }} could not be read: {{ failure }}</p>
        </template>
        <template v-if="facts">
            <header class="agent-page-head">
                <span class="agent-page-title">Agent {{ agent }}</span>
                <span class="agent-page-facts">{{ facts.role }} · {{ facts.driver }}</span>
            </header>
            <template v-if="narrow">
                <nav class="agent-tabbar">
                    <template v-for="tab in tabbed" :key="tab.name">
                        <button type="button" :class="['agent-tab', {on: tab.on}]" @click="show(tab)">{{ tab.title }}</button>
                    </template>
                </nav>
            </template>
            <PaneStage page="agent" :face="started.face.value" :floats="false" :store="home.store" :catalogue="offered" :subscriptions="subscriptions" :environment="environment" :agent="agent" :prompts="prompts" :shell-read="shellLine" />
        </template>
    </div>
</template>

<style scoped>
.agent-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
}

.agent-page-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--line);
}

.agent-page-failure {
    margin: 0;
    padding: 16px;
    color: var(--text-2);
}

.agent-page-facts {
    color: var(--text-3);
    font-size: 12px;
}

.agent-tabbar {
    display: flex;
    gap: 4px;
    padding: 4px 8px;
    overflow-x: auto;
    border-bottom: 1px solid var(--line);
}

.agent-tab {
    padding: 6px 10px;
    border: 0;
    border-radius: 6px;
    color: var(--text-3);
    background: transparent;
    font: inherit;
    cursor: pointer;
}

.agent-tab.on {
    color: var(--text);
    background: var(--line);
}
</style>
