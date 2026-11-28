<script setup lang="ts">
import Spinner from "@kit/Spinner";
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";

/**
 * The line above the composer that names what the agent is doing right now, such as Ran npm test, so a reply on its
 * way shows progress. It shows while the agent works and has done something since its last message here.
 */
const props = defineProps<{ agent: AgentOptionData; command: string | null }>();

const isShown = computed(
  () => props.command !== null && props.agent.status.sessionState === "working",
);
</script>

<template>
  <template v-if="isShown">
    <p
      class="flex min-w-0 items-center gap-2 text-meta text-text-3"
      data-running-command
    >
      <Spinner />
      <span class="truncate font-mono" :title="command ?? undefined">{{ command }}</span>
    </p>
  </template>
</template>
