<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Button from '@kit/Button';
import { computed, nextTick, ref, watch } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import { provideIsStale } from './windowFreshness';

/**
 * Shows one result under its safe subject: its content with the reader's Data when ready, the Data shown before while
 * it is asked for again or after a refresh failed, so its content stays mounted read-only and keeps what the user was
 * doing, and a reload of its own when the first read failed. A refusal depends on where the result is placed: a page
 * of its own says the item is unavailable and offers a way back, a pane says so with Close, and a section shows
 * nothing at all. Each instance speaks only of its own read.
 */
const props = withDefaults(
    defineProps<{
        result: WindowResult<unknown> | null | undefined;
        keptData?: unknown;
        isWindow?: boolean;
        // The name the user may read for what this shows, such as its window's title; 'item' until one is known.
        subject?: string;
        placement?: 'page' | 'pane' | 'section';
        // Where a refused page leads back to; Home when it has no parent the user may see.
        returnUrl?: string;
    }>(),
    { keptData: undefined, isWindow: false, subject: 'item', placement: undefined, returnUrl: '/' },
);
const emit = defineEmits<{ retry: []; close: [] }>();
defineSlots<{ content(slotProps: { data: unknown }): unknown }>();

const shownPlacement = computed(() => props.placement ?? (props.isWindow ? 'pane' : 'section'));
const isRefused = computed(() => props.result?.state === 'denied' || props.result?.state === 'unavailable');
const shownData = computed(() => {
    if (props.result?.state === 'ready') {
        return props.result.data;
    }

    // A refusal replaces whatever was shown before it paints.
    return isRefused.value ? undefined : (props.keptData ?? undefined);
});
const reason = computed(() => (props.result?.state === 'failed' ? (props.result.reason ?? null) : null));
const isStale = computed(() => props.result?.state === 'failed' && shownData.value !== undefined);
const isFirstRead = computed(
    () => (props.result === null || props.result === undefined) && shownData.value === undefined,
);
const heading = ref<HTMLElement | null>(null);

provideIsStale(isStale);

// A page refused to the user moves the focus to its own heading, so the way back is read first.
watch(
    () => isRefused.value && shownPlacement.value === 'page',
    (isShown) => {
        if (isShown) {
            void nextTick(() => heading.value?.focus());
        }
    },
    { immediate: true },
);
</script>

<template>
    <template v-if="isStale">
        <div role="alert" class="flex items-center gap-3 border-b border-line px-4 py-2 text-small text-text-2">
            <span class="flex-1">Showing the last update.<template v-if="reason"> {{ reason }}</template></span>
            <Button variant="bordered" size="small" @click="emit('retry')">Reload {{ subject }}</Button>
        </div>
    </template>
    <template v-if="shownData !== undefined">
        <slot name="content" :data="shownData" />
    </template>
    <template v-else-if="result?.state === 'failed'">
        <div role="alert" class="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <p class="text-text-2">Couldn't load {{ subject }}</p>
            <template v-if="reason">
                <p class="text-small text-text-3">{{ reason }}</p>
            </template>
            <Button variant="bordered" @click="emit('retry')">Reload {{ subject }}</Button>
        </div>
    </template>
    <template v-else-if="isRefused && shownPlacement === 'page'">
        <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <h1 ref="heading" tabindex="-1" class="text-text-2 outline-none">This item is unavailable</h1>
            <Link :href="returnUrl" class="text-small underline">Go back</Link>
        </div>
    </template>
    <template v-else-if="isRefused && shownPlacement === 'pane'">
        <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <p class="text-text-2">This item is unavailable</p>
            <Button variant="bordered" size="small" @click="emit('close')">Close</Button>
        </div>
    </template>
    <template v-else-if="shownPlacement !== 'section' && isFirstRead">
        <div role="status" :aria-label="`Loading ${subject}`" class="flex flex-col gap-3 px-4 py-6">
            <span class="h-4 w-1/3 rounded-button bg-line motion-safe:animate-pulse"></span>
            <span class="h-4 w-2/3 rounded-button bg-line motion-safe:animate-pulse"></span>
            <span class="h-4 w-1/2 rounded-button bg-line motion-safe:animate-pulse"></span>
        </div>
    </template>
</template>
