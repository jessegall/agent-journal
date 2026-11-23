<script setup lang="ts">
import TextLink from "@kit/TextLink";
import { router } from "@inertiajs/vue3";
import type { Component } from "vue";
import type { WindowResult } from "@/generated/types/page-props";
import {
  hasStaleProps,
  isPropStale,
  pageReadStatus,
  retryPageRead,
  useLiveReload,
} from "@/composables/usePageChanges";
import DockOfferPicker from "./DockOfferPicker.vue";
import ResultView from "./ResultView.vue";

/**
 * A declared page of its own: its reader's result, handed to the page's component as its one data prop, and the
 * offer to dock the source it shows when there is one.
 */
withDefaults(
  defineProps<{
    component: Component;
    page: WindowResult<unknown>;
    subject?: string;
  }>(),
  {
    subject: "item",
  },
);

useLiveReload();
</script>

<template>
  <template v-if="pageReadStatus === 'failed' && hasStaleProps()">
    <p role="alert" class="text-small text-text-3">
      Showing the last update.
      <TextLink @click="retryPageRead()"> Refresh visible windows </TextLink>
    </p>
  </template>
  <template v-if="page.state === 'ready' && page.dockOffer !== undefined">
    <DockOfferPicker :offer="page.dockOffer" />
  </template>
  <ResultView
    :result="page"
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
