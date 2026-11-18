<script setup lang="ts">
import type { ShareDetailData, ShareLinkData } from '@/types/generated';
import { xsrfToken } from '@/echo';
import { router } from '@inertiajs/vue3';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { ref } from 'vue';

/**
 * One share for its owner: state, gateway, deadline and members, with retry and revoke; its audit, public reads apart
 * from the steps of its life, a page at a time; and its gateway's runtime state. Its address is fetched only when
 * the owner reveals it, kept in this component alone and never in the page's data.
 */
const props = defineProps<{ data: ShareDetailData }>();

const revealed = ref<string | null>(null);
const tab = ref<'share' | 'audit'>('share');

const actorNames = { owner: 'Owner', agent: 'Requesting agent', system: 'System', visitor: 'Unknown visitor' } as const;

function olderAudit(): void {
    router.get(`/sharing/shares/${props.data.id}`, { auditAfter: props.data.audit.nextAfter }, { preserveScroll: true, preserveState: true });
}
const revealFailed = ref(false);
const copied = ref(false);

async function reveal(): Promise<void> {
    revealFailed.value = false;
    const response = await fetch(`/sharing/shares/${props.data.id}/link`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-XSRF-TOKEN': xsrfToken() },
    });

    if (!response.ok) {
        revealFailed.value = true;

        return;
    }

    revealed.value = ((await response.json()) as ShareLinkData).url;
}

async function copy(): Promise<void> {
    if (revealed.value === null) {
        return;
    }

    await navigator.clipboard.writeText(revealed.value);
    copied.value = true;
}

function retry(): void {
    router.post(`/sharing/shares/${props.data.id}/retry`, {}, { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true });
}

function revoke(): void {
    revealed.value = null;
    router.delete(`/sharing/shares/${props.data.id}`, { headers: { 'Idempotency-Key': crypto.randomUUID() }, preserveScroll: true });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader :title="`${data.state === 'proposed' ? 'Proposal' : 'Share'} ${data.number}`" />
        <div class="flex gap-2" role="tablist">
            <button type="button" role="tab" :aria-selected="tab === 'share'" @click="tab = 'share'">Share</button>
            <button type="button" role="tab" :aria-selected="tab === 'audit'" @click="tab = 'audit'">Audit</button>
        </div>
        <section v-if="tab === 'audit'" class="flex flex-col gap-3" aria-label="Audit">
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
                    <tr v-for="entry in data.audit.entries" :key="entry.id" :class="entry.isRead ? 'text-muted' : ''">
                        <td>{{ entry.occurredAt }}</td>
                        <td>{{ entry.isRead ? `Public read: ${entry.type === 'read_allowed' ? 'allowed' : 'denied'}` : entry.type }}</td>
                        <td>{{ actorNames[entry.actor] }}</td>
                        <td>{{ entry.reasonCode ?? '' }}</td>
                    </tr>
                </tbody>
            </table>
            <button v-if="data.audit.nextAfter" type="button" @click="olderAudit">Older entries</button>
            <p v-if="data.audit.lastPrunedAt">
                Pruned on {{ data.audit.lastPrunedAt }}: {{ data.audit.prunedAllowedReads }} allowed and {{ data.audit.prunedDeniedReads }} denied reads,
                {{ data.audit.prunedLifecycleRows }} other entries.
            </p>
        </section>
        <section class="flex flex-col gap-1" aria-label="Gateway runtime">
            <p v-if="data.runtime.isOffline" role="status">Offline: start the sharing service.</p>
            <p v-else-if="data.runtime.endpointVersion === null">No endpoint is serving this share.</p>
            <p v-else>
                Endpoint version {{ data.runtime.endpointVersion }}, last healthy {{ data.runtime.lastHealthAt ?? 'never' }}:
                {{ data.runtime.isHealthy ? 'healthy' : 'stale (no health report in the last 45 seconds)' }}.
            </p>
        </section>
        <dl v-if="tab === 'share'" class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>State</dt>
            <dd>{{ data.state }}</dd>
            <dt>Record</dt>
            <dd>{{ data.rootType }}</dd>
            <dt>Gateway</dt>
            <dd>{{ data.gatewayKey ?? 'None yet' }}</dd>
            <dt>Expires</dt>
            <dd>{{ data.expiresAt }}</dd>
        </dl>
        <section v-if="tab === 'share'" class="flex flex-col gap-1" aria-label="Shared with it">
            <p v-if="data.members.length === 0">No linked record is shared with it.</p>
            <p v-for="member in data.members" :key="member.linkId">{{ member.targetType }}</p>
        </section>
        <section v-if="data.mayReveal" class="flex flex-col gap-2" aria-label="Public address">
            <div v-if="revealed" class="flex items-center gap-2">
                <code>{{ revealed }}</code>
                <Button type="button" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</Button>
            </div>
            <Button v-else type="button" @click="reveal">Reveal address</Button>
            <p v-if="revealFailed">The address is not available.</p>
        </section>
        <div class="flex gap-2">
            <Button v-if="data.mayRetry" type="button" @click="retry">Retry</Button>
            <Button v-if="data.mayRevoke" type="button" @click="revoke">{{ data.state === 'proposed' ? 'Dismiss' : 'Revoke' }}</Button>
        </div>
    </div>
</template>
