<script setup>
import {subagentsOf} from "../domain/subagents.js";
import {agent} from "../composables/leadAgent.js";
import {store} from "../state/store.js";
import {computed, inject, ref, watch} from "vue";
import {loadedSkills, usageWindows} from "../domain/agents.js";
import MenuPanel from "../kit/MenuPanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import AgentBarViews from "./AgentBarViews.vue";
import AgentControls from "./AgentControls.vue";
import AgentFacts from "./AgentFacts.vue";
import AgentMenu from "./AgentMenu.vue";
import AgentPresets from "./AgentPresets.vue";
import AgentSkills from "./AgentSkills.vue";
import AgentStack from "./AgentStack.vue";
import AgentUsage from "./AgentUsage.vue";
import CrewList from "./CrewList.vue";
import "./drop.css";
import {go, peek, route} from "../route.js";
import {useColleague} from "../composables/colleague.js";

const open = ref("");
const schemesOpen = ref(false);
watch(open, () => (schemesOpen.value = false));
const data = computed(() => (agent.value && agent.value.status !== "stopped" ? agent.value : null));
const skills = computed(() => loadedSkills(data.value));
const usage = computed(() => usageWindows(data.value));
const views = inject("views", null);

function readSkill(name) {
    store.skill = name;
    open.value = "";
}

function openSession(row) {
    open.value = "";
    peek("agents", agent.value.id, 0, row.session);
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
function openSkills() {
    open.value = "";
    go("skills");
}
const {colleague} = useColleague();
</script>

<template>
    <template v-if="colleague">
        <div class="agent-bar agent-bar-colleague">{{ colleague }}'s environment: the agent's status there is not known on this machine</div>
    </template>
    <template v-else>
        <div class="agent-bar">
            <AgentFacts :data="data" :open="open" @toggle="toggle" />
            <template v-if="data">
                <div class="agent-actions">
                    <AgentBarViews :open="open" @toggle="toggle" />
                </div>
            </template>
            <template v-if="open && anchor && data">
                <MenuPanel
                    :anchor="anchor"
                    :min-width="open === 'presets' ? 360 : 320"
                    :max-width="open === 'presets' ? 360 : 380"
                    :max-height="dropHeight"
                    @click.stop
                    @close="open = ''"
                >
                    <SwitchCase :value="CONTROLS.includes(open) ? 'model' : open">
                        <template #agent>
                            <AgentMenu :agent="agent" @done="open = ''" />
                        </template>
                        <template #skills>
                            <AgentSkills :skills="skills" @read="readSkill" @browse="openSkills" />
                        </template>
                        <template #model>
                            <AgentControls :control="open" :agent="agent" @done="open = ''" />
                        </template>
                        <template #presets>
                            <AgentPresets v-model:schemes-open="schemesOpen" @preset="pickPreset" @scheme="pickScheme" />
                        </template>
                        <template #states>
                            <AgentStack :agent="agent" />
                        </template>
                        <template #usage>
                            <AgentUsage :usage="usage" />
                        </template>
                        <template #default>
                            <CrewList heading="Subagents" :rows="subagentsOf(agent)" started="dispatched" @open="openSession" />
                        </template>
                    </SwitchCase>
                </MenuPanel>
            </template>
        </div>
    </template>
</template>

<style scoped>
.agent-bar-colleague {
    color: var(--text-3);
}

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

.agent-actions {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: auto;
}
</style>
