<script setup lang="ts">
import LayoutFieldForm from '@/components/layout/LayoutFieldForm.vue';
import LayoutFormField from '@/components/layout/LayoutFormField.vue';
import type { LayoutPartData } from '@/generated/types/core';
import { useLayoutForm } from './layoutForm';

// A field of a declared layout: inside a form it edits that form's value, elsewhere it filters its own window. The
// server sends every field part with its binding.
defineProps<{ part: LayoutPartData }>();
const form = useLayoutForm();
</script>

<template>
    <template v-if="part.field !== undefined && form !== null">
        <LayoutFormField :field="part.field" :form="form" :part="part" />
    </template>
    <template v-else-if="part.field !== undefined">
        <LayoutFieldForm :field="part.field" :part="part" />
    </template>
</template>
