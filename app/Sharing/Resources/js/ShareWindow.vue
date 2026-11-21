<script setup lang="ts">
import type { ShareDetailData } from '@generated/types/sharing';
import { keyedPost } from '@kit/keyedPost';
import { revealShareLink } from '@generated/routes/sharing';
import { router, usePage } from '@inertiajs/vue3';
import FormErrors from '@kit/FormErrors';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { ref } from 'vue';
import AuditSection from './AuditSection.vue';
import RuntimeSection from './RuntimeSection.vue';

/**
 * One share for its owner: state, gateway, deadline and members, with retry and revoke; its audit, public reads apart
 * from the steps of its life, a page at a time; and its gateway's runtime state. Its address is fetched only when
 * the owner reveals it, kept in this component alone and never in the page's data.
 */
const props = defineProps<{ data: ShareDetailData }>();

const revealed = ref<string | null>(null);
const tab = ref<'share' | 'audit'>('share');

function olderAudit(): void {
    router.get(
        `/sharing/shares/${props.data.id}`,
        { auditAfter: props.data.audit.nextAfter },
        { preserveScroll: true, preserveState: true },
    );
}
const revealFailed = ref(false);
const copied = ref(false);
// A refused retry or revoke comes back as the page's errors, shown under the header.
const page = usePage<{ errors: Record<string, string> }>();

/**
 * Reveals the address through the share's own action; it arrives as the answer's one-time flash, kept in this
 * component alone.
 */
function reveal(): void {
    revealFailed.value = false;
    keyedPost(revealShareLink(props.data.id).url, {}, crypto.randomUUID(), {
        onAccepted: (flash) => {
            const url = flash.revealedLink;
            revealed.value = typeof url === 'string' ? url : null;
            revealFailed.value = revealed.value === null;
        },
        onRefused: () => (revealFailed.value = true),
        onUncertain: () => (revealFailed.value = true),
    });
}

async function copy(): Promise<void> {
    if (revealed.value === null) {
        return;
    }

    await navigator.clipboard.writeText(revealed.value);
    copied.value = true;
}

function retry(): void {
    router.post(
        `/sharing/shares/${props.data.id}/retry`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}

function revoke(): void {
    revealed.value = null;
    router.delete(`/sharing/shares/${props.data.id}`, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
    });
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader
            :title="`${data.state === 'proposed' ? 'Proposal' : 'Share'} ${data.number}`"
        />
        <FormErrors :errors="page.props.errors" />
        <div class="flex gap-2" role="tablist">
            <button
                type="button"
                role="tab"
                :aria-selected="tab === 'share'"
                @click="tab = 'share'"
            >
                Share
            </button>
            <button
                type="button"
                role="tab"
                :aria-selected="tab === 'audit'"
                @click="tab = 'audit'"
            >
                Audit
            </button>
        </div>
        <template v-if="tab === 'audit'">
            <AuditSection :audit="data.audit" @older="olderAudit" />
        </template>
        <RuntimeSection :runtime="data.runtime" />
        <template v-if="tab === 'share'">
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
        </template>
        <template v-if="tab === 'share'">
            <section class="flex flex-col gap-1" aria-label="Shared with it">
                <template v-if="data.members.length === 0">
                    <p>No linked record is shared with it.</p>
                </template>
                <template v-for="member in data.members" :key="member.linkId">
                    <p>{{ member.targetType }}</p>
                </template>
            </section>
        </template>
        <template v-if="data.mayReveal">
            <section class="flex flex-col gap-2" aria-label="Public address">
                <template v-if="revealed">
                    <div class="flex items-center gap-2">
                        <code>{{ revealed }}</code>
                        <Button type="button" @click="copy">{{
                            copied ? 'Copied' : 'Copy'
                        }}</Button>
                    </div>
                </template>
                <template v-else>
                    <Button type="button" @click="reveal"
                        >Reveal address</Button
                    >
                </template>
                <template v-if="revealFailed">
                    <p>The address is not available.</p>
                </template>
            </section>
        </template>
        <div class="flex gap-2">
            <template v-if="data.mayRetry">
                <Button type="button" @click="retry">Retry</Button>
            </template>
            <template v-if="data.mayRevoke">
                <Button type="button" @click="revoke">{{
                    data.state === 'proposed' ? 'Dismiss' : 'Revoke'
                }}</Button>
            </template>
        </div>
    </div>
</template>
