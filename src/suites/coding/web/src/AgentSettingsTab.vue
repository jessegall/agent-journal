<script setup>
import {SwitchCase, TabBody} from "@journal/window-kit";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsAssign from "./AgentSettingsAssign.vue";
import AgentSettingsScreen from "./AgentSettingsScreen.vue";

// the tab the agent settings show: the long tabs are drawn from the screens the settings declare, the helpers tab
// from its own table and the assign tab from the rules
defineProps({tab: {type: String, required: true}, active: {type: Object, required: true}, draft: {type: Object, required: true}, isLoaded: Boolean, nodes: {type: Function, required: true}, readOnly: Boolean, found: {type: String, default: ""}, nothingStarts: Boolean, advancedExtras: {type: Object, required: true}});
</script>

<template>
    <div :class="['settings-body', {flush: tab === 'agents'}]">
        <TabBody :tab="active">
            <SwitchCase :value="tab">
                <template #work>
                    <template v-if="isLoaded">
                        <AgentSettingsScreen key="work" :nodes="nodes('work')" :draft="draft" :read-only="readOnly" :found="found" data-agent-settings-work>
                            <template #before>
                                <template v-if="nothingStarts">
                                    <p class="hint" data-work-hint>With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.</p>
                                </template>
                            </template>
                        </AgentSettingsScreen>
                    </template>
                </template>
                <template #agents>
                    <AgentSettingsAgents :draft="draft" />
                </template>
                <template #assign>
                    <AgentSettingsAssign :draft="draft" :read-only="readOnly" />
                </template>
                <template #tests>
                    <template v-if="isLoaded">
                        <AgentSettingsScreen key="tests" :nodes="nodes('tests')" :draft="draft" :read-only="readOnly" :found="found" data-agent-settings-tests />
                    </template>
                </template>
                <template #advanced>
                    <template v-if="isLoaded">
                        <AgentSettingsScreen key="advanced" :nodes="nodes('advanced')" :draft="draft" :read-only="readOnly" :found="found" :extras="advancedExtras" data-agent-settings-advanced />
                    </template>
                </template>
            </SwitchCase>
        </TabBody>
    </div>
</template>
