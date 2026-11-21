<script setup lang="ts">
import LayoutFieldForm from '@/components/layout/LayoutFieldForm.vue';
import type { LayoutPartData } from '@/generated/types/core';

// A field of a declared layout; the server sends every field part with its binding.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <template v-if="part.field !== undefined">
        <LayoutFieldForm
            :field="part.field"
            :label="part.text ?? ''"
            :hint="part.detail ?? undefined"
        />
    </template>
</template>
