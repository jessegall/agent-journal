<script setup lang="ts">
import DockedCard from "@kit/DockedCard";
import type { DockCardEnvelope } from "@kit/dockCards";
import { startHanding } from "../../../composables/useHandOver";
import DockPart from "../../../components/dock/DockPart.vue";
import { visitLink } from "../../../dockLinks";

/**
 * One docked card on the kit's DockedCard: its owner's parts, or only its summary when nothing more may be shown, with
 * Open when its owner gives a page to open and Undock. Any card can be dragged onto an agent to hand it over.
 */
const props = defineProps<{ card: DockCardEnvelope }>();

const emit = defineEmits<{ undock: [] }>();

function hand(event: DragEvent): void {
  const source = props.card.source;
  startHanding(event, {
    title: props.card.accessibleName,
    reference: props.card.open?.href ?? `${source.type} ${source.id}`,
  });
}

function open(): void {
  visitLink(props.card.open);
}
</script>

<template>
  <DockedCard
    :title="card.accessibleName"
    :can-open="card.open !== null"
    draggable="true"
    @dragstart="hand"
    @open="open"
    @undock="emit('undock')"
  >
    <template v-if="card.root">
      <DockPart
        :node="card.root"
        :path="`${card.placementId}/${card.root.key}`"
      />
    </template>
    <template v-else>
      <p class="truncate text-small text-text-2">{{ card.safeSummary }}</p>
    </template>
  </DockedCard>
</template>
