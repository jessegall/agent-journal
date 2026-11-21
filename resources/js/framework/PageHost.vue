<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Component } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import { pageReadStatus, retryPageRead, useLiveReload } from '@/composables/usePageChanges';
import DockOfferPicker from './DockOfferPicker.vue';
import ResultView from './ResultView.vue';

/**
 * A declared page of its own: its reader's result, handed to the page's component as its one data prop, and the
 * offer to dock the source it shows when there is one.
 */
defineProps<{ component: Component; page: WindowResult<unknown> }>();

useLiveReload();
</script>

<template>
    <template v-if="pageReadStatus === 'failed'">
        <p role="status" class="text-small text-text-3">
            This page could not be refreshed.
            <button type="button" class="underline" @click="retryPageRead()">Retry</button>
        </p>
    </template>
    <template v-if="page.state === 'ready' && page.dockOffer !== undefined">
        <DockOfferPicker :offer="page.dockOffer" />
    </template>
    <ResultView :result="page" @retry="router.reload({ only: ['page'] })">
        <template #content="{ data }">
            <component :is="component" :data="data" />
        </template>
    </ResultView>
</template>
