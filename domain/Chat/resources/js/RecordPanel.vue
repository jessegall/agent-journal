<script setup lang="ts">
import type { DockCardEnvelope } from '@kit/dockCards';
import Icon from '@kit/Icon';
import IconButton from '@kit/IconButton';
import DockPart from './dock/DockPart.vue';

/**
 * The record a chat line names, open beside the chat: its title and close button, and its card's parts, such as a
 * running sequence's steps with the current one marked. The actions slot holds what its owner adds, such as Edit steps.
 */
defineProps<{ card: DockCardEnvelope }>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
    <aside
        class="absolute top-3 right-3 z-20 flex max-h-[calc(100%-24px)] w-[380px] flex-col overflow-hidden rounded-card border border-border-2 bg-raised shadow-lg max-[760px]:static max-[760px]:w-full"
        :aria-label="card.accessibleName"
    >
        <header class="flex items-center gap-2 border-b border-border px-3 py-2.5 text-body text-text">
            <Icon name="sequence" :size="14" />
            <b class="min-w-0 flex-1 truncate font-medium">{{ card.accessibleName }}</b>
            <slot name="actions" />
            <IconButton icon="close" :label="`Close ${card.accessibleName}`" size="sm" @click="emit('close')" />
        </header>
        <div class="overflow-y-auto px-3 py-3">
            <template v-if="card.root">
                <DockPart :node="card.root" :path="`${card.placementId}/${card.root.key}`" />
            </template>
            <template v-else>
                <p class="text-small text-text-2">{{ card.safeSummary }}</p>
            </template>
        </div>
    </aside>
</template>
