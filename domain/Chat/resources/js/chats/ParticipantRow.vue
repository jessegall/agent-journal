<script setup lang="ts">
import type { ParticipantData } from '@generated/types/chat';

/**
 * One member of a chat: its name, the driver an agent runs through, and whether it owns the chat; the actions the
 * viewer may take on this member sit beside it.
 */
defineProps<{ participant: ParticipantData }>();
</script>

<template>
    <li class="flex items-center gap-2 text-body">
        <span>{{ participant.label }}</span>
        <template v-if="participant.driver !== null">
            <span class="text-small text-text-3">{{ participant.driver }}</span>
        </template>
        <template v-if="participant.role === 'owner'">
            <span class="text-small text-text-3">Owner</span>
        </template>
        <span class="ml-auto flex gap-2">
            <slot />
        </span>
    </li>
</template>
