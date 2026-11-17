<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Component } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import { useLiveReload } from '@/composables/usePageChanges';
import ResultView from './ResultView.vue';

/**
 * A declared page of its own: its reader's result, handed to the page's component as its one data prop.
 */
defineProps<{ component: Component; page: WindowResult<unknown> }>();

useLiveReload();
</script>

<template>
    <ResultView :result="page" @retry="router.reload({ only: ['page'] })">
        <template #content="{ data }">
            <component :is="component" :data="data" />
        </template>
    </ResultView>
</template>
