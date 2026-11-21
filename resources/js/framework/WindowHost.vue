<script setup lang="ts">
import type { Component } from 'vue';
import { useWindowProps } from '@/composables/useWindowProps';
import { provideHostProp } from './hostProp';
import { provideWindowKey } from './useWindowQuery';
import ResultView from './ResultView.vue';

/**
 * One window on Home, or a section in a host page's slot: asks for its own optional prop unless it comes deferred, and
 * retries only that prop.
 */
const props = withDefaults(
    defineProps<{
        component: Component;
        propName: string;
        pageKey?: string;
        askOnStart?: boolean;
        title?: string;
    }>(),
    { pageKey: undefined, askOnStart: true, title: undefined },
);
const { result, keptData, retry } = useWindowProps(
    props.propName,
    props.askOnStart,
);
provideHostProp(props.propName);

if (props.pageKey !== undefined) {
    provideWindowKey(props.pageKey);
}
</script>

<template>
    <ResultView
        :result="result"
        :kept-data="keptData"
        :is-window="pageKey !== undefined"
        :title="title"
        @retry="retry"
    >
        <template #content="{ data }">
            <component :is="component" :data="data" />
        </template>
    </ResultView>
</template>
