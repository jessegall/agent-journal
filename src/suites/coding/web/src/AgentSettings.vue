<script setup>
import {computed, ref} from "vue";
import {InnerTabs, SwitchCase, WindowRoom, useWindow} from "@journal/window-kit";
import {countEntries, isFull} from "../../../../core/modules/agents/web/src/agentCounts.js";
import AgentSettingsAdvanced from "./AgentSettingsAdvanced.vue";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsTests from "./AgentSettingsTests.vue";
import AgentSettingsWork from "./AgentSettingsWork.vue";

// the agent settings, by tab under the viewer's tabs, which stay at the top: the Agents tab names how many kinds of agent are at a maximum;
// a viewer who may only read sees a note that only a person changes them
const view = useWindow();
const tab = ref("work");
const full = computed(() => countEntries(view.props.limits?.rows.value ?? []).filter((row) => isFull(row.running, row.run_limit) || isFull(row.kept, row.kept_limit)).length);
const tabs = computed(() => [{key: "work", label: "Work"}, {key: "agents", label: full.value ? `Agents ${full.value}` : "Agents"}, {key: "tests", label: "Tests"}, {key: "advanced", label: "Advanced"}]);
const active = computed(() => tabs.value.find((entry) => entry.key === tab.value));
function pick(entry) {
    tab.value = entry.key;
    view.state.tab = entry.key === "agents" ? "agents" : "";
}
</script>

<template>
    <WindowRoom padding="0">
        <div class="settings" data-agent-settings>
            <div class="settings-bar"><InnerTabs :tabs="tabs" :active="active" @choose="pick" /></div>
            <div class="settings-body">
                <template v-if="view.readOnly">
                    <p class="note lock" role="note" data-settings-lock>Only a person can change these settings. You can read every value, and ask a person for a change.</p>
                </template>
                <SwitchCase :value="tab">
                    <template #work>
                        <AgentSettingsWork />
                    </template>
                    <template #agents>
                        <AgentSettingsAgents />
                    </template>
                    <template #tests>
                        <AgentSettingsTests />
                    </template>
                    <template #advanced>
                        <AgentSettingsAdvanced />
                    </template>
                </SwitchCase>
            </div>
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings { container-type: inline-size; display: flex; flex-direction: column; min-height: 100%; background: var(--raised, var(--bg)); }
.settings-bar { position: sticky; top: 0; z-index: 2; background: var(--raised, var(--bg)); }
.settings-body { flex: 1; padding: 4px 18px 22px; }
.note { margin: 14px 0 0; padding: 8px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-dim, var(--hover)); color: var(--text); font-size: 12.5px; }
</style>
