<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';
import Button from '@/components/kit/Button.vue';
import FormErrors from '@/components/kit/FormErrors.vue';
import { useNotifications } from '@/composables/useNotifications';
import type { AskDetail } from '@/types/generated';

/**
 * One ask on its own page, as a notification opens it: what it asks, who holds it, its version and where it stands.
 * Opening it answers nothing; once shown, the reader's own receipt of it becomes read. Only the current holder of an
 * open merge ask sees Approve merge, which names the version shown, so a rerouted or newer ask refuses it and the page
 * reads the ask again.
 */
const props = defineProps<{ data: AskDetail }>();

const notifications = useNotifications();
const ask = computed(() => props.data.card);

const approval = useForm({});

/**
 * Approves at the version on screen now; a refusal reads only the page again, so it shows the ask as it stands.
 */
function approve(): void {
    approval
        .transform(() => ({ decisionId: props.data.mergeDecisionId, expectedVersion: props.data.version }))
        .post(`/asks/${props.data.card.id}/approve-merge`, { preserveScroll: true, preserveState: true, only: ['page'] });
}

onMounted(() => void notifications.markTargetRead('merge.ask', props.data.card.id));
</script>

<template>
    <Head title="Ask" />
    <main class="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 class="text-lg font-semibold">Ask</h1>
        <div class="flex items-center justify-between gap-3 text-sm text-text-3">
            <span>{{ ask.type }}</span>
            <span>{{ data.resultLabel }}</span>
        </div>
        <p class="whitespace-pre-wrap">{{ ask.body }}</p>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-text-3">
            <dt>Held by</dt>
            <dd>{{ ask.holderId === null ? 'Nobody' : `${ask.holderType} ${ask.holderId}` }}</dd>
            <dt>Version</dt>
            <dd>{{ data.version }}</dd>
        </dl>
        <template v-if="ask.reply">
            <div class="border-t border-line pt-3">
                <p class="text-sm font-medium">Reply</p>
                <p class="whitespace-pre-wrap">{{ ask.reply }}</p>
            </div>
        </template>
        <template v-if="data.canApproveMerge && data.mergeDecisionId !== null">
            <form class="flex flex-col gap-2" @submit.prevent="approve">
                <Button type="submit" variant="primary" :pending="approval.processing">Approve merge</Button>
                <FormErrors :errors="approval.errors" />
            </form>
        </template>
    </main>
</template>
