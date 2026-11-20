<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { AskInbox } from '@/types/generated';

defineProps<{ data: AskInbox }>();
</script>

<template>
    <Head title="Asks" />
    <main class="mx-auto flex max-w-3xl flex-col gap-5 p-6">
        <h1 class="text-lg font-semibold">Asks</h1>
        <p v-if="data.cards.length === 0" class="text-text-3">No asks to show.</p>
        <ul class="flex flex-col gap-3">
            <li v-for="card in data.cards" :key="card.id" class="rounded-lg border border-line p-4">
                <div class="flex items-center justify-between gap-3 text-sm text-text-3">
                    <span>{{ card.type }}</span>
                    <span>{{ card.obligation ? 'Needs your reply' : card.open ? 'Open' : 'Closed' }}</span>
                </div>
                <p class="mt-2 whitespace-pre-wrap">{{ card.body }}</p>
                <div v-if="card.reply" class="mt-3 border-t border-line pt-3">
                    <p class="text-sm font-medium">Reply</p>
                    <p class="whitespace-pre-wrap">{{ card.reply }}</p>
                </div>
            </li>
        </ul>
    </main>
</template>
