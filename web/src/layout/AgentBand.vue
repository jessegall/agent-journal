<script setup>
import { computed } from "vue";
import { saveSettings } from "../api.js";
import Toggle from "../kit/Toggle.vue";
import { route } from "../route.js";
import { agent, autoOn, reload } from "../store.js";

const state = computed(() => (agent.value && agent.value.data.status !== "stopped" ? agent.value.data.status : "stopped"));
const text = computed(() => (state.value === "stopped" ? "no agent is on this environment" : `${agent.value.data.provider || "agent"} · ${agent.value.title}`));

async function setAuto(on) {
  await saveSettings(route.value.env, { features: { auto: on } });
  await reload();
}
</script>

<template>
  <div class="band">
    <span :class="['dot', state]" />
    <span class="state">{{ state[0].toUpperCase() + state.slice(1) }}</span>
    <span class="text">{{ text }}</span>
    <span class="grow" />
    <Toggle :on="autoOn" text="auto" @change="setAuto" />
  </div>
</template>

<style scoped>
.band { flex: none; display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 14px 0 22px; border-bottom: 1px solid var(--border); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-3); }
.dot.idle { background: var(--good); }
.dot.working { background: var(--accent-text); }
.dot.waiting { background: var(--warn); }
.state { font-weight: 500; }
.text { color: var(--text-2); text-decoration: underline dotted; }
.grow { flex: 1; }
</style>
