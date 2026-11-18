<script setup lang="ts">
import type { ShareDetailData } from '@generated/types/sharing';

/**
 * A share's audit, a page at a time: public reads set apart from the steps of its life, and what pruning removed.
 */

const actorNames = {
    owner: 'Owner',
    agent: 'Requesting agent',
    system: 'System',
    visitor: 'Unknown visitor',
} as const;
defineProps<{ audit: ShareDetailData['audit'] }>();
defineEmits<{ older: [] }>();
</script>

<template>
    <section class="flex flex-col gap-3" aria-label="Audit">
        <table>
            <thead>
                <tr>
                    <th>When</th>
                    <th>What</th>
                    <th>Who</th>
                    <th>Why</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="entry in audit.entries" :key="entry.id">
                    <tr :class="entry.isRead ? 'text-muted' : ''">
                        <td>{{ entry.occurredAt }}</td>
                        <td>
                            {{
                                entry.isRead
                                    ? `Public read: ${entry.type === 'read_allowed' ? 'allowed' : 'denied'}`
                                    : entry.type
                            }}
                        </td>
                        <td>{{ actorNames[entry.actor] }}</td>
                        <td>{{ entry.reasonCode ?? '' }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <template v-if="audit.nextAfter">
            <button type="button" @click="$emit('older')">Older entries</button>
        </template>
        <template v-if="audit.lastPrunedAt">
            <p>
                Pruned on {{ audit.lastPrunedAt }}:
                {{ audit.prunedAllowedReads }} allowed and
                {{ audit.prunedDeniedReads }} denied reads,
                {{ audit.prunedLifecycleRows }} other entries.
            </p>
        </template>
    </section>
</template>
