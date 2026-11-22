<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { isPropStale } from '@/composables/usePageChanges';
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
        // The registration's public title, which names this window in its loading and failure words.
        subject?: string;
    }>(),
    { pageKey: undefined, askOnStart: true, subject: undefined },
);

const emit = defineEmits<{ close: [] }>();
const isBatchStale = computed(() => isPropStale(props.propName));
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
        :subject="subject ?? (pageKey !== undefined ? 'this window' : 'this section')"
        :placement="pageKey !== undefined ? 'pane' : 'section'"
        :is-batch-stale="isBatchStale"
        @retry="retry"
        @close="emit('close')"
    >
        <template #content="{ data }">
            <component :is="component" :data="data" />
        </template>
    </ResultView>
</template>
