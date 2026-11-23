<script setup lang="ts">
import Button from '@kit/Button';
import { dateTime } from '@kit/format';
import type { ShareAuditData } from '@generated/types/sharing';
import { useWindowReload } from '@kit/useWindowQuery';

/**
 * A share's audit as a native part of its page, a page at a time: public reads set apart from the steps of its life,
 * each moment in the viewer's zone, and what pruning removed. Older entries are read into this window alone.
 */
const actorNames = {
    owner: 'Owner',
    agent: 'Requesting agent',
    system: 'System',
    visitor: 'Unknown visitor',
} as const;
const audit = defineProps<ShareAuditData>();
const reload = useWindowReload();

type AuditEntry = ShareAuditData['entries'][number];

/** What happened: a public read says whether it was allowed, every other step is named by its type. */
function whatHappened(entry: AuditEntry): string {
    if (!entry.isRead) {
        return entry.type;
    }

    return `Public read: ${entry.type === 'read_allowed' ? 'allowed' : 'denied'}`;
}

function older(): void {
    if (audit.nextAfter === null) {
        return;
    }

    reload(
        { tab: 'audit', auditAfter: audit.nextAfter },
        { onNetworkError: () => true, onHttpException: () => true },
    );
}
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
                    <tr :class="entry.isRead ? 'text-muted-foreground' : ''">
                        <td>{{ dateTime(entry.occurredAt) }}</td>
                        <td>
                            {{ whatHappened(entry) }}
                        </td>
                        <td>{{ actorNames[entry.actor] }}</td>
                        <td>{{ entry.reasonCode ?? '' }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <template v-if="audit.nextAfter">
            <Button variant="bordered" @click="older">Older entries</Button>
        </template>
        <template v-if="audit.lastPrunedAt">
            <p>
                Cleared old entries on {{ audit.lastPrunedAt }}:
                {{ audit.prunedAllowedReads }} allowed and
                {{ audit.prunedDeniedReads }} refused reads, and
                {{ audit.prunedLifecycleRows }} others.
            </p>
        </template>
    </section>
</template>
