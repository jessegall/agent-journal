<script setup>
import {ref} from "vue";
import {AgentRowList, InnerTabs, SwitchCase, TabBody, WindowRoom, useRows, useWindow} from "@journal/window-kit";
import WorkerRecent from "./WorkerRecent.vue";

// the workers this environment sent, and beside them what the workers did lately, as version 4's list showed both
const context = useWindow();
const tab = ref(context.tabs?.[0]);
const {rows, failure, loaded} = useRows("agent list --role worker", ["agent.*"]);
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
