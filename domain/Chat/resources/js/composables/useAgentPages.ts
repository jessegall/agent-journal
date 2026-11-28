import type { AgentOptionData, AgentPageCursorData } from "@generated/types/chat";
import { chatAgentPage, load, LoaderCancelled } from "@kit/loaders";
import { computed, ref } from "vue";

/**
 * The chat list past the first page the chat window brought: each later page read by its loader as the list reaches
 * its end, appended after the first page, an agent the first page holds listed once.
 */
export function useAgentPages(firstPage: () => AgentOptionData[], firstNext: () => AgentPageCursorData | null) {
  const later = ref<AgentOptionData[]>([]);
  const hasReadLater = ref(false);
  const laterNext = ref<AgentPageCursorData | null>(null);
  const isLoading = ref(false);

  const next = computed(() => (hasReadLater.value ? laterNext.value : firstNext()));
  const hasMore = computed(() => next.value !== null);
  const listed = computed(() => {
    const first = firstPage();
    const onFirst = new Set(first.map((agent) => agent.id));

    return [...first, ...later.value.filter((agent) => !onFirst.has(agent.id))];
  });

  function loadMore(): void {
    const cursor = next.value;

    if (cursor === null || isLoading.value) {
      return;
    }

    isLoading.value = true;
    load(chatAgentPage, cursor).then(
      (answer) => {
        isLoading.value = false;

        if (answer.status === "ok") {
          later.value = [...later.value, ...answer.value.agents];
          laterNext.value = answer.value.next;
          hasReadLater.value = true;
        }
      },
      (error: Error) => {
        isLoading.value = false;

        if (!(error instanceof LoaderCancelled)) {
          throw error;
        }
      },
    );
  }

  return { listed, hasMore, isLoading, loadMore };
}
