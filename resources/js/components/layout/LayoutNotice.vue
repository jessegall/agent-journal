<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import EmptyState from '@/components/kit/EmptyState.vue';
import RowSkeleton from '@/components/kit/RowSkeleton.vue';
import StaleListNotice from '@/components/kit/StaleListNotice.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutPartData } from '@/generated/types/core';

// A notice of a declared layout: an empty state, placeholder rows under one busy line while a read is pending, the
// earlier rows' stale notice whose Retry reads only this window's prop again, an error that names what could not be
// read (its action, Try again or a create action, is the part beside it), or a titled message that alerts on a
// refusal.
defineProps<{ part: LayoutPartData }>();
const hostProp = useHostProp();

function retry(): void {
    router.reload({ only: [hostProp] });
}
</script>

<template>
    <SwitchCase :value="part.style">
        <template #empty>
            <EmptyState
                icon="info"
                :title="part.text ?? ''"
                :text="part.detail ?? undefined"
            />
        </template>
        <template #skeleton>
            <RowSkeleton :rows="part.placeholders" :label="part.text ?? ''" />
        </template>
        <template #stale>
            <StaleListNotice :reason="part.text ?? ''" @retry="retry" />
        </template>
        <template #error>
            <div role="alert" data-layout-notice="error">
                <EmptyState
                    icon="alert"
                    :title="part.text ?? ''"
                    :text="part.detail ?? undefined"
                />
            </div>
        </template>
        <template #default>
            <div
                :role="part.style === 'refusal' ? 'alert' : undefined"
                :data-layout-notice="part.style"
                class="rounded border border-line px-3 py-2"
            >
                <p class="font-semibold text-text">{{ part.text }}</p>
                <template v-if="part.detail !== null">
                    <p class="text-text-2">{{ part.detail }}</p>
                </template>
            </div>
        </template>
    </SwitchCase>
</template>
