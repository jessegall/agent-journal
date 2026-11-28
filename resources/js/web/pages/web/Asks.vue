<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { AskInbox } from '@/types/generated';

defineProps<{ data: AskInbox }>();

function statusOf(card: AskInbox['cards'][number]): string {
    if (card.isObligation) {
        return 'Needs your reply';
    }

    return card.isOpen ? 'Open' : 'Closed';
}
</script>

<template>
    <Head title="Asks" />
    <main class="mx-auto flex max-w-3xl flex-col gap-5 p-6">
        <h1 class="text-lg font-semibold">Asks</h1>
        <template v-if="data.cards.length === 0">
            <p class="text-text-3">No questions waiting.</p>
        </template>
        <ul class="flex flex-col gap-3">
            <template v-for="card in data.cards" :key="card.id">
                <li class="rounded-lg border border-line p-4">
                    <div class="flex items-center justify-between gap-3 text-sm text-text-3">
                        <span>{{ card.type }}</span>
                        <span>{{ statusOf(card) }}</span>
                    </div>
                    <p class="mt-2 whitespace-pre-wrap">{{ card.body }}</p>
                    <template v-if="card.reply">
                        <div class="mt-3 border-t border-line pt-3">
                            <p class="text-sm font-medium">Reply</p>
                            <p class="whitespace-pre-wrap">{{ card.reply }}</p>
                        </div>
                    </template>
                </li>
            </template>
        </ul>
    </main>
</template>
