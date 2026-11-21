<script setup lang="ts">
import type { DeviceApprovalData } from '@generated/types/connections';
import { approve } from '@generated/routes/connections/devices';
import Button from '@kit/Button';
import PageHeader from '@kit/PageHeader';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

/**
 * The owner approves a shell's device code after comparing it with the code the shell shows, and checking the
 * folder, machine and scopes it is for.
 */
const props = defineProps<{ data: DeviceApprovalData }>();

const approved = ref(false);

function approveCode(): void {
    router.post(
        approve({ code: props.data.userCode }).url,
        {},
        {
            only: ['page'],
            preserveState: true,
            onSuccess: () => (approved.value = true),
        },
    );
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-[560px] flex-col gap-4 sm:pt-4">
        <PageHeader title="Approve a terminal" />
        <section class="flex flex-col gap-3 px-4 sm:px-0">
            <p>
                A terminal on {{ data.machineLabel }} asks to run journal
                commands for {{ data.projectLabel }}.
            </p>
            <p class="font-mono text-small">{{ data.userCode }}</p>
            <p class="text-small text-muted">
                Approve only when the terminal shows this same code. It lets
                that terminal run journal commands for this project for twelve
                hours.
            </p>
            <template v-if="approved">
                <p class="text-small">Approved. Go back to the terminal.</p>
            </template>
            <template v-else>
                <div>
                    <Button variant="primary" @click="approveCode"
                        >Approve</Button
                    >
                </div>
            </template>
        </section>
    </div>
</template>
