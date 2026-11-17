<script setup lang="ts">
import { computed } from 'vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { WindowResult } from '@/generated/types/page-props';

/**
 * Shows one result: its content with the reader's Data when ready, the neutral message and a retry when it failed
 * (with the Data shown before, if any), and nothing when the signed-in user may not see it.
 */
const props = defineProps<{ result: WindowResult<unknown> | null | undefined; keptData?: unknown }>();
defineEmits<{ retry: [] }>();
defineSlots<{ content(slotProps: { data: unknown }): unknown }>();

const readyData = computed(() => (props.result?.state === 'ready' ? props.result.data : undefined));
const failure = computed(() => (props.result?.state === 'failed' ? props.result.message : ''));
const hasKeptData = computed(() => props.keptData !== undefined && props.keptData !== null);
</script>

<template>
    <SwitchCase :value="result?.state ?? 'waiting'">
        <template #ready>
            <slot name="content" :data="readyData" />
        </template>
        <template #failed>
            <div>
                <template v-if="hasKeptData">
                    <slot name="content" :data="keptData" />
                </template>
                <p>{{ failure }}</p>
                <button type="button" @click="$emit('retry')">Retry</button>
            </div>
        </template>
    </SwitchCase>
</template>
