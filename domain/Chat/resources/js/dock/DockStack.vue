<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { undock as undockRoute } from '@generated/routes/chat';
import type { DockPageData } from '@generated/types/chat';
import { keepStoredJson, readStoredJson } from '@kit/browserStorage';
import type { DockCardEnvelope } from '@kit/dockCards';
import { isAnswerCurrent, protectedViewGeneration } from '@kit/protectedView';
import { newRequestId } from '@kit/requestId';
import DockCard from './DockCard.vue';
import { provideDockFolds } from './dockFolds';

/**
 * The sources docked in this conversation, one bordered stack of full-width cards above the composer, newest first.
 * The user folds the whole stack or a part of a card, and the fold is kept by the card's placement and the part's
 * path, so a refresh keeps it. An empty dock takes no space. When a grant may have been taken away it empties at once,
 * and only an answer asked for after that fills it again.
 */
const props = defineProps<{
    dock: DockPageData;
    inboxId: string;
    loadMore: (token: string) => void;
}>();

const FOLDS = 'chat-dock-folds';
const STACK = '__stack';

const folds = ref<Record<string, boolean>>({});
const asked = ref(false);
const loaded = ref<DockCardEnvelope[]>([...props.dock.cards]);
const isOpen = computed(() => folds.value[STACK] ?? true);

onMounted(() => {
    folds.value = readStoredJson('local', FOLDS, (decoded) =>
        typeof decoded === 'object' && decoded !== null ? (decoded as Record<string, boolean>) : null,
    ) ?? {};
});

watch(protectedViewGeneration, () => {
    loaded.value = [];
    asked.value = false;
});

watch(
    () => props.dock,
    (page) => {
        if (!isAnswerCurrent()) {
            return;
        }

        const known = new Set(asked.value ? loaded.value.map((card) => card.placementId) : []);
        const earlier = asked.value ? loaded.value : [];
        loaded.value = [...earlier, ...page.cards.filter((card) => !known.has(card.placementId))];
        asked.value = false;
    },
);

function fold(path: string, open: boolean): void {
    folds.value = { ...folds.value, [path]: open };
    keepStoredJson('local', FOLDS, folds.value);
}

provideDockFolds({ folds, fold });

function more(): void {
    asked.value = true;
    props.loadMore(props.dock.more);
}

function undock(card: DockCardEnvelope): void {
    router.post(
        undockRoute().url,
        {
            inboxId: props.inboxId,
            placementId: card.placementId,
            type: card.source.type,
            id: card.source.id,
        },
        { preserveScroll: true, preserveState: true, headers: { 'Idempotency-Key': newRequestId() } },
    );
}
</script>

<template>
    <template v-if="loaded.length > 0">
        <section class="flex max-h-[40%] min-h-0 flex-none flex-col rounded-control border border-border-2" aria-label="Docked in this chat">
            <header class="flex items-center gap-2 border-b border-border px-3 py-1 text-small text-text-3">
                <button type="button" :aria-expanded="isOpen" class="hover:text-text" @click="fold(STACK, !isOpen)">
                    {{ loaded.length }} loaded
                </button>
                <span class="flex-1"></span>
                <button type="button" class="hover:text-text" @click="more">Check for more</button>
            </header>
            <template v-if="isOpen">
                <ul class="min-h-0 overflow-y-auto">
                    <template v-for="card in loaded" :key="card.placementId">
                        <DockCard :card="card" @undock="undock(card)" />
                    </template>
                </ul>
            </template>
        </section>
    </template>
</template>
