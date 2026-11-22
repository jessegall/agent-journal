<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref, useId } from 'vue';
import Field from '@/components/kit/Field.vue';
import Input from '@/components/kit/Input.vue';
import { useWindowQueryChange } from '@/framework/useWindowQuery';
import type { LayoutFieldData, LayoutPartData } from '@/generated/types/core';

// A filter field's form: submitting writes its one key into its own window's query and clears the keys the server
// names, such as the page and the chosen row, keeping every other key; its id comes from this mount.
const props = defineProps<{
    field: LayoutFieldData;
    part: LayoutPartData;
}>();
const windowQuery = useWindowQueryChange();
const fieldId = `layout-field-${useId()}`;
const value = ref(props.field.value);

function apply(): void {
    router.visit(
        windowQuery({
            ...Object.fromEntries(
                props.field.clears.map((name) => [name, undefined]),
            ),
            [props.field.name]: value.value,
        }),
        {
            preserveState: true,
            preserveScroll: true,
        },
    );
}
</script>

<template>
    <form role="search" class="flex items-end gap-2" @submit.prevent="apply">
        <template v-if="part.style === 'search'">
            <Input
                :id="fieldId"
                v-model="value"
                type="search"
                class="w-full @2xl:w-50"
                :aria-label="part.text ?? ''"
                :placeholder="part.text ?? ''"
            />
        </template>
        <template v-else>
            <Field
                :id="fieldId"
                v-model="value"
                :label="part.text ?? ''"
                :hint="part.detail ?? undefined"
            />
        </template>
    </form>
</template>
