<script setup>
import {ref} from "vue";
import {Segmented, WindowRoom, useWindow} from "@journal/window-kit";
import AgentSettingsAgents from "./AgentSettingsAgents.vue";
import AgentSettingsWork from "./AgentSettingsWork.vue";

const TABS = [{key: "work", label: "Work"}, {key: "agents", label: "Agents"}];
const view = useWindow();
const tab = ref("work");
function pick(key) {
    tab.value = key;
    view.state.tab = key === "agents" ? "agents" : "";
}
</script>

<template>
    <WindowRoom>
        <div class="settings" data-agent-settings>
            <Segmented :options="TABS" :value="tab" @pick="pick" />
            <AgentSettingsWork v-if="tab === 'work'" />
            <AgentSettingsAgents v-else />
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings { display: flex; flex-direction: column; gap: 8px; }
</style>
