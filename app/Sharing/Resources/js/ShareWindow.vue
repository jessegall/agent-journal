<script setup lang="ts">
import type { ShareDetailData, ShareLinkData } from '@/types/generated';
import { xsrfToken } from '@/echo';
import { router } from '@inertiajs/vue3';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { ref } from 'vue';

/**
 * One share for its owner: state, gateway, deadline and members, with retry and revoke. Its address is fetched only
 * when the owner reveals it, kept in this component alone and never in the page's data.
 */
const props = defineProps<{ data: ShareDetailData }>();

const revealed = ref<string | null>(null);
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
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>State</dt>
            <dd>{{ data.state }}</dd>
            <dt>Record</dt>
            <dd>{{ data.rootType }}</dd>
            <dt>Gateway</dt>
            <dd>{{ data.gatewayKey ?? 'None yet' }}</dd>
            <dt>Expires</dt>
            <dd>{{ data.expiresAt }}</dd>
        </dl>
        <section class="flex flex-col gap-1" aria-label="Shared with it">
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
