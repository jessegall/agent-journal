<script setup>
import {computed, ref} from "vue";
import {InnerTabs, SwitchCase, TabBody, WindowRoom, useWindow} from "@journal/window-kit";
import AgentSettingsAdvanced from "./AgentSettingsAdvanced.vue";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsTests from "./AgentSettingsTests.vue";
import AgentSettingsWork from "./AgentSettingsWork.vue";

// the agent settings, by tab under the viewer's tabs, which stay at the top; a viewer who may only read sees a note that only a person changes them
const view = useWindow();
const tab = ref("work");
const tabs = [{key: "work", label: "Work"}, {key: "agents", label: "Helpers"}, {key: "tests", label: "Tests"}, {key: "advanced", label: "Advanced"}];
const active = computed(() => tabs.find((entry) => entry.key === tab.value));
function pick(entry) {
    tab.value = entry.key;
    view.state.tab = entry.key === "agents" ? "agents" : "";
}
</script>

<template>
    <WindowRoom padding="0">
        <div class="settings" data-agent-settings>
            <div class="settings-bar"><InnerTabs :tabs="tabs" :active="active" @choose="pick" /></div>
            <div :class="['settings-body', {flush: tab === 'agents'}]">
                <template v-if="view.readOnly">
                    <p class="note lock" role="note" data-settings-lock>Only a person can change these settings. You can read every value, and ask a person for a change.</p>
                </template>
                <TabBody :tab="active">
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
                </TabBody>
            </div>
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings { --settings-bar-height: 32px; container-type: inline-size; display: flex; flex-direction: column; min-height: 100%; background: var(--raised, var(--bg)); }
.settings-bar { position: sticky; top: 0; z-index: 2; background: var(--raised, var(--bg)); }
.settings-body { flex: 1; padding: 4px 18px 22px; }
.flush { padding: 0 0 22px; }
.flush .note { margin-left: 18px; margin-right: 18px; }
.note { margin: 14px 0 0; padding: 8px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent-dim, var(--hover)); color: var(--text); font-size: 12.5px; }
</style>
