<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { DockCardEnvelope } from '@kit/dockCards';
import DockPart from './DockPart.vue';

/**
 * One docked card: its owner's parts with the page it opens, or only its summary when nothing more may be shown, and
 * the control that undocks it.
 */
defineProps<{ card: DockCardEnvelope }>();
const emit = defineEmits<{ undock: [] }>();
</script>

<template>
    <li class="flex items-start gap-2 border-b border-border px-3 py-2 last:border-b-0" :aria-label="card.accessibleName">
        <div class="min-w-0 flex-1">
            <template v-if="card.root">
                <DockPart :node="card.root" :path="`${card.placementId}/${card.root.key}`" />
            </template>
            <template v-else>
                <p class="truncate text-small text-text-2">{{ card.safeSummary }}</p>
            </template>
        </div>
        <template v-if="card.open">
            <Link :href="card.open.href" class="text-small text-text-3 underline">Open</Link>
        </template>
        <button type="button" class="text-small text-text-3 hover:text-text" aria-label="Remove from chat" @click="emit('undock')">
            Remove
        </button>
    </li>
</template>
