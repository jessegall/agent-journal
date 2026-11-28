<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router, usePage } from "@inertiajs/vue3";
import { ref, watch } from "vue";
import type { Component } from "vue";
import { useAppContext } from "@/framework/appContext";
import type { WindowResult } from "@/generated/types/page-props";
import {
  hasStaleProps,
  isPropStale,
  pageReadStatus,
  retryPageRead,
} from "@/composables/usePageChanges";
import WindowOfferPicker from "./WindowOfferPicker.vue";
import ResultView from "./ResultView.vue";

/**
 * A declared page of its own: its reader's result, handed to the page's component as its one data prop, and the
 * offer to dock the source it shows when there is one.
 */
const props = withDefaults(
  defineProps<{
    component: Component;
    page: WindowResult<unknown>;
    subject?: string;
  }>(),
  {
    subject: "item",
  },
);

const visit = usePage();
const { viewer } = useAppContext();
const keptData = ref<unknown>();
watch(
  [() => props.page, () => visit.url?.split("?")[0], () => viewer.value?.id],
  ([result, path, actor], old) => {
    if (path !== old?.[1] || actor !== old?.[2] || result.status === "denied" || result.status === "unavailable") {
      keptData.value = undefined;
    }

    if (result.status === "ready") {
      keptData.value = result.data;
    }
  },
  { immediate: true },
);
</script>

<template>
  <template v-if="pageReadStatus === 'failed' && hasStaleProps()">
    <p role="alert" class="text-small text-text-3">
      Showing the last update.
      <TextLink @click="retryPageRead()"> Refresh visible windows </TextLink>
    </p>
  </template>
  <template v-if="page.status === 'ready' && page.offer !== undefined">
    <WindowOfferPicker :offer="page.offer" />
  </template>
  <ResultView
    :result="page"
    :kept-data="keptData"
    is-window
    :subject="subject"
    placement="page"
    :is-batch-stale="isPropStale('page')"
    @retry="router.reload({ only: ['page'] })"
  >
    <template #content="{ data }">
      <component :is="component" :data="data" />
    </template>
  </ResultView>
</template>
