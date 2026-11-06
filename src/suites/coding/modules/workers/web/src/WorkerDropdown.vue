<script setup>
import {computed} from "vue";
import {AgentRowList, InnerTabs, SwitchCase, TabBody, WindowRoom, useWindow} from "@journal/window-kit";
import WorkerRecent from "./WorkerRecent.vue";

// the workers this environment sent, and beside them what the workers did lately, as version 4's list showed both
const window = useWindow();
window.state.tab = window.tabs[0]?.key ?? "workers";
const tab = computed({get: () => window.tabs.find((tab) => tab.key === window.state.tab), set: (tab) => (window.state.tab = tab.key)});
const {rows, failure, loaded} = window.props.workers;
</script>

<template>
    <WindowRoom padding="0">
        <InnerTabs :active="tab" @choose="tab = $event" />
        <TabBody class="worker-tab-body" :tab="tab">
            <SwitchCase :value="tab?.key">
                <template #workers>
                    <AgentRowList :rows="rows" :failure="failure" :loaded="loaded" none="No workers have been sent from here" />
                </template>
                <template #recent>
                    <WorkerRecent />
                </template>
            </SwitchCase>
        </TabBody>
    </WindowRoom>
</template>

<style scoped>
.worker-tab-body {
    padding: 14px 16px;
}
</style>
