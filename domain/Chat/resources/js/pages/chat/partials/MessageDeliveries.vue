<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router } from "@inertiajs/vue3";
import { computed, nextTick } from "vue";
import type { ChatMessageData, DeliveryData } from "@generated/types/chat";
import { retryDelivery } from "@generated/routes/chat";

/**
 * The delivery line under the viewer's own bubble, right-aligned with it: for each recipient still being reached
 * whether it is delivering, waits for its agent to start, or was not delivered with the reason and Retry. Once every
 * recipient has it the line says Delivered, under the latest message only, and on hover for older ones.
 */
const props = defineProps<{
  message: ChatMessageData;
  conversationProp: string;
  // Whether this is the viewer's latest message, the only one that keeps Delivered in view.
  isLatest: boolean;
}>();

const unsettled = computed(() => props.message.deliveries.filter((delivery) => delivery.state !== "accepted"));

const isDelivered = computed(() => props.message.deliveries.length > 0 && unsettled.value.length === 0);

const stateWords: Record<DeliveryData["state"], (delivery: DeliveryData) => string> = {
  pending: () => "Delivering…",
  waiting_for_startup: (delivery) => `Waiting for ${delivery.label} to start`,
  accepted: () => "Delivered",
  exhausted: () => "Not delivered",
  cancelled: () => "No longer delivered",
};

function lineId(delivery: DeliveryData): string {
  return `delivery-${props.message.id}-${delivery.recipient}`;
}

function retry(delivery: DeliveryData): void {
  if (delivery.rangeId === null) {
    return;
  }

  router.post(
    retryDelivery().url,
    { rangeId: delivery.rangeId },
    {
      preserveScroll: true,
      preserveState: true,
      only: [props.conversationProp],
      onFinish: () => void nextTick(() => document.getElementById(lineId(delivery))?.focus()),
    },
  );
}
</script>

<template>
  <template v-if="isDelivered">
  <p
    :class="[
      'text-right text-meta leading-[15px] text-text-4 tabular-nums',
      isLatest
        ? ''
        : 'pointer-events-none absolute top-[calc(100%+3px)] right-0 whitespace-nowrap opacity-0 transition-opacity duration-(--duration-hover) group-focus-within/own:opacity-100 group-hover/own:opacity-100',
    ]"
  >
    Delivered
  </p>
  </template>
  <template v-else-if="unsettled.length > 0">
  <ul
    class="flex flex-col items-end gap-0.5 text-right text-meta leading-[15px] text-text-4 tabular-nums"
    aria-label="Delivery"
  >
    <template v-for="delivery in unsettled" :key="delivery.recipient">
      <li :id="lineId(delivery)" tabindex="-1" class="flex flex-wrap items-center justify-end gap-x-1.5">
        <span :class="delivery.state === 'exhausted' ? 'font-medium text-danger' : ''">{{
          message.deliveries.length > 1 ? `${delivery.label}: ${stateWords[delivery.state](delivery)}` : stateWords[delivery.state](delivery)
        }}</span>
        <template v-if="delivery.state === 'exhausted' && delivery.reason !== null">
          <span class="text-border-3">·</span>
          <span class="text-text-3">{{ delivery.reason }}</span>
        </template>
        <template v-if="message.actions.canRetryDelivery && delivery.rangeId !== null">
          <span class="text-border-3">·</span>
          <TextLink variant="quiet" @click="retry(delivery)">Retry</TextLink>
        </template>
      </li>
    </template>
  </ul>
  </template>
</template>
