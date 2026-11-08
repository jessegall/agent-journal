<script setup>
import {onMounted, ref} from "vue";
import {useWindow} from "@journal/window-kit";
import AgentCountsPanel from "../../../../core/modules/agents/web/src/AgentCountsPanel.vue";

// the agents tab: how many agents of each type run and are kept, against their maximums, with the agents of a type and their retiring
const view = useWindow();
const title = ref("Agent counts");
const openAgent = (agent) => view.open("agents.agents", agent.id);
// the counts are read with the agents tab, so a window opened on another tab reads them when this tab first shows
onMounted(() => view.reload("limits"));
</script>

<template>
    <section class="agents" data-agent-settings-agents>
        <h3 class="agents-title">{{ title }}</h3>
        <AgentCountsPanel v-model:title="title" @open-agent="openAgent" />
    </section>
</template>

<style scoped>
.agents { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.agents-title { margin: 0; font-size: 13px; }
</style>
