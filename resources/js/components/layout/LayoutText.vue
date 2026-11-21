<script setup lang="ts">
import SwitchCase from '@/components/kit/SwitchCase.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A line of text of a declared layout, drawn by its style.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <SwitchCase :value="part.style">
        <template #heading>
            <h2 class="font-semibold text-card text-text">
                {{ part.text }}
            </h2>
        </template>
        <template #code>
            <code class="font-mono text-field">{{ part.text }}</code>
        </template>
        <template #muted>
            <span data-layout-text="muted" class="text-text-3">{{
                part.text
            }}</span>
        </template>
        <template #default>
            <span :data-layout-text="part.style" class="text-text">{{
                part.text
            }}</span>
        </template>
    </SwitchCase>
</template>
