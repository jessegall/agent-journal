<script setup lang="ts">
import EmptyState from '@/components/kit/EmptyState.vue';
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A notice of a declared layout: an empty state, or a titled message that alerts on an error.
defineProps<{ part: LayoutPartData }>();
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
        <template #default>
            <div
                :role="
                    part.style === 'error' || part.style === 'refusal'
                        ? 'alert'
                        : undefined
                "
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
