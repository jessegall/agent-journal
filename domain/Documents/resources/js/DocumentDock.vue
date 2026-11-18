<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type { DockCard, DockData } from '@generated/types/documents';
import Button from '@kit/Button';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The documents and reports docked in this session: cards that open their pages, a Hide action, and the hidden
 * cards to show again.
 */
const props = defineProps<{ data: DockData }>();

const showHidden = ref(false);

function send(path: string, card: DockCard): void {
    router.post(path, { type: card.type, number: card.number, session: props.data.sessionId }, { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <section class="flex flex-col gap-2">
        <template v-for="card in data.cards" :key="`${card.type}-${card.number}`">
            <article class="flex items-start gap-2">
                <a :href="card.route" class="flex flex-1 flex-col">
                    <span class="font-mono tabular-nums text-small">{{ card.type }} {{ card.number }}</span>
                    <span>{{ card.title }}</span>
                    <span class="text-small text-text-3">{{ card.abstract }}</span>
                </a>
                <Button @click="send('/documents/dock/hide', card)">Hide</Button>
            </article>
        </template>
        <template v-if="data.hasMore">
            <a href="/documents" class="text-small">More in the library</a>
        </template>
        <template v-if="data.hidden.length > 0">
            <Button @click="showHidden = !showHidden">{{ showHidden ? 'Hide hidden cards' : `Show hidden (${data.hidden.length})` }}</Button>
            <template v-if="showHidden">
                <template v-for="card in data.hidden" :key="`hidden-${card.type}-${card.number}`">
                    <div class="flex items-center gap-2 text-text-3">
                        <span class="flex-1">{{ card.type }} {{ card.number }} {{ card.title }}</span>
                        <Button @click="send('/documents/dock', card)">Show again</Button>
                    </div>
                </template>
            </template>
        </template>
    </section>
</template>
