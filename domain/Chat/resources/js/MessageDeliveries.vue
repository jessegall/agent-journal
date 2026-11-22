<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { nextTick } from 'vue';
import type { ChatMessageData, DeliveryData } from '@generated/types/chat';
import { retryDelivery } from '@generated/routes/chat';

/**
 * How far each woken recipient of one row got, as its author or an operator sees it: still trying or waiting for it
 * to start, which needs no action, or given up with the reason and the character the text still waits from. An
 * operator retries only that recipient's delivery; afterwards the focus rests on that recipient's line.
 */
const props = defineProps<{ message: ChatMessageData; conversationProp: string }>();

const stateLabels: Record<DeliveryData['state'], string> = {
    pending: 'Delivering…',
    waiting_for_startup: 'Waiting for it to start',
    accepted: 'Delivered',
    exhausted: 'Not delivered',
    cancelled: 'No longer delivered',
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
    <ul class="flex flex-col gap-0.5 text-small text-text-3" aria-label="Delivery">
        <template v-for="delivery in message.deliveries" :key="delivery.recipient">
            <template v-if="delivery.state !== 'accepted'">
                <li :id="lineId(delivery)" tabindex="-1" class="flex gap-2">
                    <span>{{ delivery.label }}: {{ stateLabels[delivery.state] }}</span>
                    <template v-if="delivery.state === 'exhausted' && delivery.reason !== null">
                        <span>{{ delivery.reason }}</span>
                    </template>
                    <template v-if="delivery.state === 'exhausted' && delivery.pendingFrom !== null">
                        <span>from character {{ delivery.pendingFrom }}</span>
                    </template>
                    <template v-if="message.actions.retryDelivery && delivery.rangeId !== null">
                        <button type="button" class="underline" @click="retry(delivery)">Retry</button>
                    </template>
                </li>
            </template>
        </template>
    </ul>
</template>
