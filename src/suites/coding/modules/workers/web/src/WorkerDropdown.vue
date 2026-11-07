<script setup>
import {computed} from "vue";
import {AgentRowList, InnerTabs, SwitchCase, TabBody, WindowRoom, useWindow} from "@journal/window-kit";
import WorkerRecent from "./WorkerRecent.vue";
import WorkerSplit from "./WorkerSplit.vue";

// the workers this environment sent, and beside them what the workers did lately, as version 4's list showed both
const view = useWindow();
view.state.tab = view.tabs[0]?.key ?? "workers";
const tab = computed({get: () => view.tabs.find((tab) => tab.key === view.state.tab), set: (tab) => (view.state.tab = tab.key)});
const {rows, failure, loaded} = view.props.workers;
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
                <template #split>
                    <WorkerSplit />
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
