<script setup lang="ts">
import type { DeviceApprovalData } from '@generated/types/connections';
import { approve } from '@generated/routes/connections/devices';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { dateTimeWithZone } from '@kit/format';
import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

/**
 * The owner approves a terminal's request after comparing its code with the code the terminal shows and checking
 * the project, device and journal it is for. What the window shows is the request as the journal holds it, so a
 * reload or a second tab never offers Approve twice; the result or the refusal is announced once.
 */
const props = defineProps<{ data: DeviceApprovalData }>();

const pending = ref(false);
const refusal = ref<string | null>(null);

const canApprove = computed(() => props.data.state === 'pending' && !props.data.isBindingRevoked);
// A revoked request shows neither its code nor its device; an ended one cannot be approved from stale data.
const isRevoked = computed(() => props.data.isBindingRevoked || props.data.state === 'revoked');

const outcome = computed(() => {
    if (props.data.isBindingRevoked) {
        return "This project's connection was revoked, so this terminal cannot be approved.";
    }

    switch (props.data.state) {
        case 'approved':
        case 'issued':
            return 'Approved. Return to your terminal.';
        case 'expired':
            return 'Expired: this terminal can no longer be approved. Run the journal command again in the terminal to get a new code.';
        case 'revoked':
            return 'This terminal sign-in was revoked. Run the journal command again in the terminal to ask anew.';
        default:
            return null;
    }
});

function approveCode(): void {
    if (pending.value || !canApprove.value) {
        return;
    }

    pending.value = true;
    refusal.value = null;
    router.post(
        approve({ code: props.data.userCode }).url,
        {},
        {
            only: ['page'],
            preserveState: true,
            onError: (errors) => (refusal.value = Object.values(errors)[0] ?? 'The journal did not approve this terminal.'),
            onFinish: () => (pending.value = false),
        },
    );
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[560px] flex-col gap-4 sm:pt-4">
        <PageHeader title="Approve a terminal" />
        <section class="flex flex-col gap-3 px-4 sm:px-0">
            <dl v-if="!isRevoked" class="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-small">
                <dt class="text-muted-foreground">Project</dt>
                <dd>{{ data.projectLabel }} / {{ data.environmentLabel }}</dd>
                <dt class="text-muted-foreground">Device</dt>
                <dd>{{ data.machineLabel }}</dd>
                <dt class="text-muted-foreground">Journal</dt>
                <dd>{{ data.journalOrigin }}</dd>
                <dt class="text-muted-foreground">Compare code</dt>
                <dd class="font-mono">{{ data.userCode }}</dd>
                <dt class="text-muted-foreground">Access</dt>
                <dd>Run permitted commands as you in {{ data.projectLabel }} for up to 12 hours</dd>
                <dt class="text-muted-foreground">Expires</dt>
                <dd>{{ dateTimeWithZone(data.expiresAt) }}</dd>
            </dl>
            <template v-if="canApprove">
                <p class="text-small text-muted-foreground">
                    Approve only when the terminal shows this same code.
                </p>
            </template>
            <p class="text-small" role="status" aria-live="polite">{{ outcome ?? '' }}</p>
            <template v-if="canApprove">
                <div>
                    <Button variant="primary" :pending="pending" @click="approveCode">Approve</Button>
                </div>
            </template>
            <template v-if="isRevoked || data.state === 'expired'">
                <a href="/connections" class="text-small underline">Return to Settings</a>
            </template>
            <template v-if="refusal !== null">
                <p class="text-small text-danger" role="alert">{{ refusal }}</p>
            </template>
        </section>
    </div>
</template>
