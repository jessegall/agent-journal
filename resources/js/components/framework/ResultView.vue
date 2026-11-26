<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import Button from "@kit/Button";
import RowSkeleton from "@kit/RowSkeleton";
import StaleListNotice from "@kit/StaleListNotice";
import { computed, nextTick, ref, watch } from "vue";
import type { WindowResult } from "@/generated/types/page-props";
import { provideIsStale } from "../../framework/windowFreshness";

/**
 * Shows one result under its safe subject: its content when ready, the Data shown before while it is asked again or a
 * refresh failed, and a reload of its own when the first read failed. A refusal on a page offers a way back, in a pane
 * offers Close, and in a section shows nothing.
 */
const props = withDefaults(
  defineProps<{
    result: WindowResult<unknown> | null | undefined;
    keptData?: unknown;
    isWindow?: boolean;
    // The name the user may read for what this shows, such as its window's title; 'item' until one is known.
    subject?: string;
    placement?: "page" | "pane" | "section";
    // Where a refused page leads back to; Home when it has no parent the user may see.
    returnUrl?: string;
    // Whether the page read that included this result failed; the page then shows the one notice.
    isBatchStale?: boolean;
  }>(),
  {
    keptData: undefined,
    isWindow: false,
    subject: "item",
    placement: undefined,
    returnUrl: "/",
    isBatchStale: false,
  },
);
const emit = defineEmits<{ retry: []; close: [] }>();
defineSlots<{ content(slotProps: { data: unknown }): unknown }>();

const shownPlacement = computed(
  () => props.placement ?? (props.isWindow ? "pane" : "section"),
);
const hasFailed = computed(() => props.result?.status === "failed");
const isRefused = computed(
  () =>
    props.result?.status === "denied" || props.result?.status === "unavailable",
);
const shownData = computed(() => {
  if (props.result?.status === "ready") {
    return props.result.data;
  }

  // A refusal replaces whatever was shown before it paints.
  return isRefused.value ? undefined : (props.keptData ?? undefined);
});
const reason = computed(() =>
  props.result?.status === "failed" ? (props.result.reason ?? null) : null,
);
const isEnvelopeStale = computed(
  () => props.result?.status === "failed" && shownData.value !== undefined,
);
// Retained content stays readable with its commands disabled while either its own read or the page's batch failed.
const isStale = computed(
  () =>
    isEnvelopeStale.value ||
    (props.isBatchStale && shownData.value !== undefined),
);
const isFirstRead = computed(
  () =>
    (props.result === null || props.result === undefined) &&
    shownData.value === undefined,
);
const heading = ref<HTMLElement | null>(null);
const anchor = ref<HTMLElement | null>(null);
const isRetrying = ref(false);

function retry(): void {
  isRetrying.value = true;
  emit("retry");
}

// A Retry keeps the focus on its own control; when that control goes with the failure, the focus moves to the heading
// of the region that was read again.
watch(
  () => isEnvelopeStale.value || hasFailed.value,
  (isFailed) => {
    if (isFailed || !isRetrying.value) {
      return;
    }

    isRetrying.value = false;
    void nextTick(() => {
      const target =
        anchor.value?.parentElement?.querySelector<HTMLElement>("h1, h2, h3");

      target?.setAttribute("tabindex", "-1");
      target?.focus();
    });
  },
);

provideIsStale(isStale);

// A page refused to the user moves the focus to its own heading, so the way back is read first.
watch(
  () => isRefused.value && shownPlacement.value === "page",
  (isShown) => {
    if (isShown) {
      void nextTick(() => heading.value?.focus());
    }
  },
  { immediate: true },
);
</script>

<template>
  <span ref="anchor" class="hidden"></span>
  <template v-if="isEnvelopeStale">
    <StaleListNotice :reason="reason ?? ''" @retry="retry" />
  </template>
  <template v-if="shownData !== undefined">
    <slot name="content" :data="shownData" />
  </template>
  <template v-else-if="result?.status === 'failed'">
    <div
      role="alert"
      class="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <p class="text-text-2">Could not load {{ subject }}</p>
      <template v-if="reason">
        <p class="text-small text-text-3">{{ reason }}</p>
      </template>
      <Button variant="bordered" @click="retry">Try again</Button>
    </div>
  </template>
  <template v-else-if="isRefused && shownPlacement === 'page'">
    <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <h1 ref="heading" tabindex="-1" class="text-text-2 outline-none">
        This item is unavailable
      </h1>
      <Link :href="returnUrl" class="text-small underline">Go back</Link>
    </div>
  </template>
  <template v-else-if="isRefused && shownPlacement === 'pane'">
    <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p class="text-text-2">This item is unavailable</p>
      <Button variant="bordered" size="small" @click="emit('close')"
        >Close</Button
      >
    </div>
  </template>
  <template v-else-if="shownPlacement !== 'section' && isFirstRead">
    <RowSkeleton :label="`Loading ${subject}`" />
  </template>
</template>
