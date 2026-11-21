<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, useId } from 'vue';
import TextField from '@/components/kit/TextField.vue';
import { useWindowQuery } from '@/framework/useWindowQuery';
import type { LayoutFieldData, LayoutPartData } from '@/generated/types/core';

// A filter field's form: submitting writes its one key into its own window's query and clears the list cursor, so
// the filtered list starts on its first page; its id comes from this mount.
const props = defineProps<{
    field: LayoutFieldData;
    part: LayoutPartData;
}>();
const windowQuery = useWindowQuery();
const fieldId = `layout-field-${useId()}`;
const value = ref(props.field.value);

function apply(): void {
    router.visit(
        windowQuery({ [props.field.name]: value.value, cursor: undefined }),
        {
            preserveState: true,
            preserveScroll: true,
        },
    );
}
</script>

<template>
    <form role="search" class="flex items-end gap-2" @submit.prevent="apply">
        <TextField
            :id="fieldId"
            v-model="value"
            :label="part.text ?? ''"
            :hint="part.detail ?? undefined"
        />
    </form>
</template>
