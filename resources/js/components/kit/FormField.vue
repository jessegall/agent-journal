<script setup lang="ts">
/**
 * One labelled field of a form: its label, the control the slot draws, and either the field's error or its hint
 * under it. The slot gets the ids the control points its label and description at.
 */
const props = withDefaults(
    defineProps<{
        id: string;
        label: string;
        error?: string;
        hint?: string;
    }>(),
    { error: undefined, hint: undefined },
);

const describedBy = `${props.id}-description`;
</script>

<template>
    <div class="flex flex-col gap-1">
        <label :for="id" class="text-small text-text-2">{{ label }}</label>
        <slot
            :id="id"
            :described-by="error || hint ? describedBy : undefined"
            :invalid="error ? 'true' : undefined"
        />
        <p v-if="error" :id="describedBy" class="text-small text-danger">
            {{ error }}
        </p>
        <p v-else-if="hint" :id="describedBy" class="text-small text-text-3">
            {{ hint }}
        </p>
    </div>
</template>
