<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { AskDetail } from '@/types/generated';

/**
 * One ask on its own page, as a notification opens it: what it asks, who holds it, its version and where it stands.
 * Opening it answers nothing.
 */
const props = defineProps<{ data: AskDetail }>();

const ask = computed(() => props.data.card);
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
    </main>
</template>
