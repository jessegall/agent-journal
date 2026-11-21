<script setup lang="ts">
import { computed } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';

/**
 * Shows one result: its content with the reader's Data when ready, the Data shown before while it is asked for again
 * or after it failed, so its content stays mounted and keeps what the user was doing, the neutral message and a retry
 * when it failed, and nothing when the signed-in user may not see it.
 */
const props = defineProps<{ result: WindowResult<unknown> | null | undefined; keptData?: unknown }>();
defineEmits<{ retry: [] }>();
defineSlots<{ content(slotProps: { data: unknown }): unknown }>();

const shownData = computed(() => {
    if (props.result?.state === 'ready') {
        return props.result.data;
    }

    return props.result?.state === 'denied' ? undefined : (props.keptData ?? undefined);
});
const failure = computed(() => (props.result?.state === 'failed' ? props.result.message : ''));
</script>

<template>
    <slot v-if="shownData !== undefined" name="content" :data="shownData" />
    <div v-if="result?.state === 'failed'">
        <p>{{ failure }}</p>
        <button type="button" @click="$emit('retry')">Retry</button>
    </div>
</template>
