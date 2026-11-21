<script setup lang="ts">
import Button from '@kit/Button';
import { computed } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';
import { provideIsStale } from './windowFreshness';

/**
 * Shows one result: its content with the reader's Data when ready, the Data shown before while it is asked for again
 * or after a refresh failed, so its content stays mounted read-only and keeps what the user was doing, the neutral
 * message and a retry when the first read failed, and nothing when the signed-in user may not see it. A window, unlike
 * a section, also shows a skeleton named by its title while its first read runs and says when access is refused.
 */
const props = withDefaults(
    defineProps<{
        result: WindowResult<unknown> | null | undefined;
        keptData?: unknown;
        isWindow?: boolean;
        title?: string;
    }>(),
    { keptData: undefined, isWindow: false, title: undefined },
);
defineEmits<{ retry: [] }>();
defineSlots<{ content(slotProps: { data: unknown }): unknown }>();

const shownData = computed(() => {
    if (props.result?.state === 'ready') {
        return props.result.data;
    }

    return props.result?.state === 'denied' ||
        props.result?.state === 'unavailable'
        ? undefined
        : (props.keptData ?? undefined);
});
const failure = computed(() =>
    props.result?.state === 'failed' ? props.result.message : '',
);
const isStale = computed(
    () => props.result?.state === 'failed' && shownData.value !== undefined,
);
const isFirstRead = computed(
    () =>
        (props.result === null || props.result === undefined) &&
        shownData.value === undefined,
);

provideIsStale(isStale);
</script>

<template>
    <template v-if="isStale">
        <div
            role="alert"
            class="flex items-center gap-3 border-b border-line px-4 py-2 text-small text-text-2"
        >
            <span class="flex-1"
                >This window could not be refreshed. It shows what it last
                loaded.</span
            >
            <Button variant="bordered" size="small" @click="$emit('retry')"
                >Retry</Button
            >
        </div>
    </template>
    <template v-if="shownData !== undefined">
        <slot name="content" :data="shownData" />
    </template>
    <template v-else-if="result?.state === 'failed'">
        <div
            role="alert"
            class="flex flex-col items-center gap-3 px-4 py-10 text-center"
        >
            <p class="text-text-2">{{ failure }}</p>
            <Button variant="bordered" @click="$emit('retry')">Retry</Button>
        </div>
    </template>
    <template v-else-if="isWindow && result?.state === 'denied'">
        <p class="px-4 py-10 text-center text-text-2">
            You don't have access to this.
        </p>
    </template>
    <template v-else-if="isWindow && result?.state === 'unavailable'">
        <p class="px-4 py-10 text-center text-text-2">This is not available.</p>
    </template>
    <template v-else-if="isWindow && isFirstRead">
        <div
            role="status"
            :aria-label="title ? `Loading ${title}` : 'Loading'"
            class="flex flex-col gap-3 px-4 py-6"
        >
            <span class="h-4 w-1/3 animate-pulse rounded-button bg-line"></span>
            <span class="h-4 w-2/3 animate-pulse rounded-button bg-line"></span>
            <span class="h-4 w-1/2 animate-pulse rounded-button bg-line"></span>
        </div>
    </template>
</template>
