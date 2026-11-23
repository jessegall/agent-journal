<script setup lang="ts">
import TextLink from '@kit/TextLink';
import { router } from "@inertiajs/vue3";
import { computed, onMounted, ref, watch } from "vue";
import { undock as undockRoute } from "@generated/routes/chat";
import type { DockPageData } from "@generated/types/chat";
import { keepStoredJson, readStoredJson } from "@kit/browserStorage";
import type { DockCardEnvelope } from "@kit/dockCards";
import { isAnswerCurrent, protectedViewGeneration } from "@kit/protectedView";
import { newRequestId } from "@kit/requestId";
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import DockCard from "./DockCard.vue";
import { provideDockFolds } from "./dockFolds";

/**
 * The sources docked in this conversation, a stack of cards above the composer, newest first, under a header that
 * counts them. With more than one the stack folds to the newest with its edges showing; Show all fans it out and Fold
 * settles it back. The user folds the whole stack or a part of a card, and the fold is kept by the card's placement
 * and the part's path, so a refresh keeps it. An empty dock takes no space. When a grant may have been taken away it empties at once,
 * and only an answer asked for after that fills it again.
 */
const props = defineProps<{
  dock: DockPageData;
  inboxId: string;
  loadMore: (token: string) => void;
}>();

const FOLDS = "chat-dock-folds";
const STACK = "__stack";

const folds = ref<Record<string, boolean>>({});
const asked = ref(false);
const loaded = ref<DockCardEnvelope[]>([...props.dock.cards]);
// With more than one card the stack folds to the newest, its edges showing, until Show all fans it out.
const isOpen = computed(() => folds.value[STACK] ?? false);
const shown = computed(() =>
  isOpen.value ? loaded.value : loaded.value.slice(0, 1),
);

onMounted(() => {
  folds.value =
    readStoredJson("local", FOLDS, (decoded) =>
      typeof decoded === "object" && decoded !== null
        ? (decoded as Record<string, boolean>)
        : null,
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

    const known = new Set(
      asked.value ? loaded.value.map((card) => card.placementId) : [],
    );
    const earlier = asked.value ? loaded.value : [];
    loaded.value = [
      ...earlier,
      ...page.cards.filter((card) => !known.has(card.placementId)),
    ];
    asked.value = false;
  },
);

function fold(path: string, open: boolean): void {
  folds.value = { ...folds.value, [path]: open };
  keepStoredJson("local", FOLDS, folds.value);
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
    {
      preserveScroll: true,
      preserveState: true,
      headers: { "Idempotency-Key": newRequestId() },
    },
  );
}
</script>

<template>
  <template v-if="loaded.length > 0">
    <section
      class="mb-2 flex max-h-[40%] min-h-0 flex-none flex-col gap-1.5"
      aria-label="Docked to this chat"
    >
      <header class="flex items-center gap-2 text-small text-text-3">
        <Icon name="pin" :size="14" />
        <span>{{ loaded.length }} docked</span>
        <span class="flex-1"></span>
        <TextLink variant="quiet" @click="more">
          Check for more
        </TextLink>
        <template v-if="loaded.length > 1">
          <Button
            size="small"
            variant="ghost"
            :aria-expanded="isOpen"
            @click="fold(STACK, !isOpen)"
          >
            {{ isOpen ? "Fold" : `Show all ${loaded.length}` }}
          </Button>
        </template>
      </header>
      <ul class="flex min-h-0 flex-col gap-1.5 overflow-y-auto">
        <template v-for="(card, index) in shown" :key="card.placementId">
          <li
            :class="{
              'shadow-[0_4px_0_-1px_var(--raised),0_4px_0_0_var(--border-3),0_8px_0_-2px_var(--raised),0_8px_0_-1px_var(--border-3)] rounded-card':
                !isOpen && index === 0 && loaded.length > 1,
            }"
          >
            <DockCard :card="card" @undock="undock(card)" />
          </li>
        </template>
      </ul>
    </section>
  </template>
</template>
