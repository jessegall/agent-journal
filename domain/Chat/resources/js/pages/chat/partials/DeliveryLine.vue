<script setup lang="ts">
import Button from "@kit/Button";
import DeliveryTicks from "@kit/DeliveryTicks";
import Icon from "@kit/Icon";
import { computed } from "vue";
import type { MessageEntryData } from "@generated/types/chat";

/**
 * How far one of the user's own messages got, right under its bubble and always shown: one tick sent, with what it
 * waits for while the agent starts, two ticks arrived, two filled ticks read, or Not delivered with the reason and
 * Retry. The words show on hover and to a screen reader.
 */
const props = defineProps<{
  message: MessageEntryData;
  // Whom the message went to, as the words name them.
  addresseeName: string;
  // What the message waits for while it is only sent, such as the agent's start; none while nothing holds it.
  startWait: string | null;
}>();

const emit = defineEmits<{ retry: [] }>();

const words = computed(
  () =>
    ({
      sent: `Sent · not yet with ${props.addresseeName}`,
      arrived: `Arrived at ${props.addresseeName}`,
      read: `Read by ${props.addresseeName}`,
      failed: "Not delivered",
    })[props.message.delivery],
);
</script>

<template>
  <span
    class="flex flex-wrap items-center justify-end gap-x-1.5 self-end text-right text-meta leading-[15px] text-text-4"
    :data-delivery="message.delivery"
  >
    <template v-if="message.delivery === 'failed'">
      <span class="inline-flex items-center gap-1 font-medium text-danger"
        ><Icon name="alert" :size="12" />Not delivered</span
      >
      <template v-if="message.deliveryFailure">
        <span class="text-text-3">{{ message.deliveryFailure }}</span>
      </template>
      <Button size="small" variant="ghost" data-retry-delivery @click="emit('retry')">Retry</Button>
    </template>
    <template v-else>
      <template v-if="message.delivery === 'sent' && startWait">
        <span data-start-wait>{{ startWait }}</span>
      </template>
      <DeliveryTicks :state="message.delivery" :label="words" />
    </template>
  </span>
</template>
