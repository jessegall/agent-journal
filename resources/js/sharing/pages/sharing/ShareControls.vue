<script setup lang="ts">
import type { ShareControlsPartData } from '@generated/types/sharing';
import { keyedPost } from '@kit/keyedPost';
import { revealShareLink } from '@generated/routes/sharing';
import { router, usePage } from '@inertiajs/vue3';
import FormErrors from '@kit/FormErrors';
import Button from '@kit/Button';
import { ref, watch } from 'vue';

/**
 * A share's direct controls as a native part of its page: reveal and copy its address, retry and revoke. The address
 * is fetched only when the owner reveals it, kept in this component alone and never in the page's data, and dropped
 * when the share changes or is revoked; a refused retry or revoke comes back as the page's errors, shown here.
 */
const props = defineProps<ShareControlsPartData>();

const revealed = ref<string | null>(null);
const revealFailed = ref(false);
const copied = ref(false);
const page = usePage<{ errors: Record<string, string> }>();

watch(
    () => [props.id, props.mayReveal],
    () => {
        revealed.value = null;
        copied.value = false;
    },
);

/**
 * Reveals the address through the share's own action; it arrives as the answer's one-time flash, kept in this
 * component alone.
 */
function reveal(): void {
    revealFailed.value = false;
    keyedPost(revealShareLink(props.id).url, {}, crypto.randomUUID(), {
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
        `/sharing/shares/${props.id}/retry`,
        {},
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}

function revoke(): void {
    revealed.value = null;
    router.delete(`/sharing/shares/${props.id}`, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
    });
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <FormErrors :errors="page.props.errors" />
        <template v-if="mayReveal">
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
            <template v-if="mayRetry">
                <Button type="button" @click="retry">Retry</Button>
            </template>
            <template v-if="mayRevoke">
                <Button type="button" @click="revoke">{{
                    status === 'proposed' ? 'Dismiss' : 'Revoke'
                }}</Button>
            </template>
        </div>
    </div>
</template>
