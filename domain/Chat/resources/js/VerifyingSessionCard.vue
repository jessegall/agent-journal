<script setup lang="ts">
import Card from "@kit/Card";
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import AgentSessionActions from "./AgentSessionActions.vue";

/**
 * The card above the composer while the agent's start has not proved which conversation it runs: its state, why, that
 * messages sent now wait until it is verified, and Check status and Cancel. It shows for no other state.
 */
const props = defineProps<{ agent: AgentOptionData }>();

const isShown = computed(
  () =>
    props.agent.status.sessionState === "verifying" ||
    props.agent.status.sessionState === "unverified",
);
</script>

<template>
  <template v-if="isShown">
    <Card role="status" aria-live="polite" data-verifying-session>
      <div class="flex flex-col gap-1.5">
        <h3 class="text-small font-medium text-text">{{ agent.status.label }}</h3>
        <template v-if="agent.status.reason">
          <p class="text-small text-text-2">{{ agent.status.reason }}</p>
        </template>
        <p class="text-small text-text-3">
          Messages you send now wait and go out once the session is verified.
        </p>
        <AgentSessionActions :agent="agent" />
      </div>
    </Card>
  </template>
</template>
