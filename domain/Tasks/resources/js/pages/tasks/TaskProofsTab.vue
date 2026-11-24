<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import Button from '@kit/Button';
import SwitchCase from '@kit/SwitchCase';
import type { TaskProofData, TaskProofsData } from '@generated/types/tasks';
import { useWindowReload } from '@kit/useWindowQuery';

/**
 * A task's Proofs tab: each check with what it checked, its outcome or that it waits for its result, its run, who
 * asked for it and the receipt it was bound to. It tells loading, an empty read (No proofs yet), a failed read with
 * Retry, never claiming a check passed, and a refused read, which clears the rows.
 */
const props = defineProps<{ proofs: TaskProofsData | undefined }>();

const reload = useWindowReload();
const state = reactive({
    proofs: [] as TaskProofData[],
    nextAfter: undefined as string | undefined,
    askedAfter: '',
    status: 'idle' as 'idle' | 'loading' | 'shown' | 'failed' | 'restricted',
});

watch(
    () => props.proofs,
    (page) => {
        if (page === undefined || page.after !== state.askedAfter) {
            return;
        }

        const known = new Set(state.proofs.map((proof) => proof.id));
        state.proofs =
            page.after === ''
                ? [...page.proofs]
                : [...state.proofs, ...page.proofs.filter((proof) => !known.has(proof.id))];
        state.nextAfter = page.nextAfter;
        state.status = 'shown';
    },
    { immediate: true },
);

function ask(after: string): void {
    state.askedAfter = after;
    state.status = 'loading';
    reload(after === '' ? { section: 'proofs' } : { section: 'proofs', proofs_after: after }, {
        onNetworkError: () => {
            state.status = 'failed';

            return false;
        },
        onHttpException: (response) => {
            const isRefused = response.status === 403 || response.status === 404;
            state.status = isRefused ? 'restricted' : 'failed';

            if (isRefused) {
                state.proofs = [];
            }

            return false;
        },
    });
}

onMounted(() => {
    if (state.status === 'idle') {
        ask('');
    }
});
</script>

<template>
    <div class="flex flex-col gap-2">
        <SwitchCase :value="state.status">
            <template #restricted>
                <p class="text-body text-text-3">You can't read this task's proofs.</p>
            </template>
            <template #failed>
                <p role="alert" class="flex items-center gap-2 text-small text-text-2">
                    <span>The proofs could not be read.</span>
                    <Button
                        size="small"
                        variant="bordered"
                        @click="ask(state.askedAfter)"
                        >Retry</Button
                    >
                </p>
            </template>
            <template v-if="state.proofs.length === 0" #loading>
                <p role="status" class="text-small text-text-3">Loading the proofs</p>
            </template>
            <template v-if="state.proofs.length === 0" #shown>
                <p class="text-body text-text-3">No proofs yet</p>
            </template>
        </SwitchCase>
        <ol class="flex flex-col gap-2" aria-label="Proofs">
            <template v-for="proof in state.proofs" :key="proof.id">
                <li class="flex flex-col gap-0.5 border-l-2 border-border pl-2 text-small">
                    <span class="font-medium text-text-2 [overflow-wrap:anywhere]">{{
                        proof.operation
                    }}</span>
                    <span class="text-text-2">{{
                        proof.outcome === undefined
                            ? 'Waiting for its result'
                            : `Outcome: ${proof.outcome}`
                    }}</span>
                    <span class="flex flex-wrap gap-x-2 text-text-3">
                        <span class="tabular-nums">Run {{ proof.runNumber }}</span>
                        <span>{{ proof.producerType }} {{ proof.producerId }}</span>
                        <time :datetime="proof.registeredAt">{{
                            new Date(proof.registeredAt).toLocaleString()
                        }}</time>
                    </span>
                    <span class="text-text-3">{{
                        proof.receiptId === undefined
                            ? `Process run ${proof.processRunId}, no receipt yet`
                            : `Receipt ${proof.receiptId}`
                    }}</span>
                </li>
            </template>
        </ol>
        <template v-if="state.nextAfter !== undefined">
            <div>
                <Button
                    size="small"
                    variant="bordered"
                    :pending="state.status === 'loading'"
                    @click="ask(state.nextAfter)"
                    >Show older proofs</Button
                >
            </div>
        </template>
    </div>
</template>
