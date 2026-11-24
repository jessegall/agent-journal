<script setup lang="ts">
import { router } from "@inertiajs/vue3";
import Select from "@kit/Select";
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";

/**
 * The agents Home can talk to, idle ones included, as a choice of one: Enter, Space or Down open the list, the arrow
 * keys move between agents and Enter or a click chooses one. Each choice is a link by agent id, so a refresh keeps
 * it, and the chosen agent and its state are announced.
 */
const props = defineProps<{
  agents: AgentOptionData[];
  selectedAgentId: string | undefined;
  agentUrl: (agent: AgentOptionData) => string;
}>();

const selected = computed(() =>
  props.agents.find((agent) => agent.id === props.selectedAgentId),
);
const agentOptions = computed(() =>
  props.agents.map((agent) => ({ value: agent.id, label: `${agent.name} · ${agent.status.label}` })),
);

function choose(agentId: string | null): void {
  const agent = props.agents.find((option) => option.id === agentId);

  if (agent !== undefined) {
    router.visit(props.agentUrl(agent), { preserveScroll: true });
  }
}
</script>

<template>
  <div class="border-b border-border py-2">
    <template v-if="agents.length === 0">
      <p class="text-small text-text-3">No agents yet.</p>
    </template>
    <template v-else>
      <Select
        :model-value="selected?.id ?? null"
        :options="agentOptions"
        placeholder="Choose an agent"
        aria-label="Agents"
        @update:model-value="choose"
      />
    </template>
    <p class="sr-only" aria-live="polite">
      <template v-if="selected"
        >{{ selected.name }}, {{ selected.status.label }}</template
      >
    </p>
  </div>
</template>
