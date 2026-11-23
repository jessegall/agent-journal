<script setup lang="ts">
import type { DockCardEnvelope } from "@kit/dockCards";
import DockPart from "./dock/DockPart.vue";

/**
 * The parts a record's owner composed for the chat, such as a long run's state and time or a sequence's steps, or only
 * its summary when nothing more may be shown.
 */
const props = defineProps<{ card: DockCardEnvelope }>();
</script>

<template>
  <template v-if="props.card.root">
    <DockPart
      :node="props.card.root"
      :path="`${props.card.placementId}/${props.card.root.key}`"
    />
  </template>
  <template v-else>
    <p class="truncate text-small text-text-2">{{ props.card.safeSummary }}</p>
  </template>
</template>
