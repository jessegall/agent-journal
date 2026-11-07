<script setup>
import {computed, ref} from "vue";
import {Dialog, Icon, useWindow} from "@journal/window-kit";
import AgentCountsPanel from "./AgentCountsPanel.vue";
import {countEntries, isFull} from "./agentCounts.js";

const emit = defineEmits(["open-agent"]);
const view = useWindow();
const open = ref(false);
const title = ref("Agent counts");
const badge = computed(() => countEntries(view.props.limits.rows.value).filter((row) => isFull(row.running, row.run_limit) || isFull(row.kept, row.kept_limit)).length);
function openAgent(agent) { open.value = false; emit("open-agent", agent); }
</script>

<template>
    <button class="counts-button" type="button" title="Agent counts" aria-label="Agent counts" data-agent-counts @click="open = true"><Icon name="settings" :size="16" /><template v-if="badge"><span class="badge" data-agent-count-badge>{{ badge }}</span></template></button>
    <template v-if="open"><Dialog :title="title" modal fits @close="open = false" @escape="open = false">
        <AgentCountsPanel v-model:title="title" @open-agent="openAgent" @close="open = false" />
    </Dialog></template>
</template>

<style scoped>
.counts-button { position: relative; width: 30px; height: 30px; border: 0; background: none; color: var(--text-2); cursor: pointer; }
.badge { position: absolute; right: -2px; top: -3px; min-width: 14px; border-radius: 8px; background: var(--accent); color: var(--raised); font-size: 10px; }
</style>
