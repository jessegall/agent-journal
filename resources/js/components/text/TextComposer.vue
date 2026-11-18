<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import FormErrors from '@/components/kit/FormErrors.vue';

/**
 * A text box with its send button, pending state and field errors. It knows nothing of what the text is for, so a
 * comment form and a chat can both use it.
 */
defineProps<{ pending: boolean; errors: Record<string, string>; placeholder: string; sendLabel: string }>();

defineEmits<{ send: [] }>();

const text = defineModel<string>({ required: true });
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="$emit('send')">
        <slot name="before" />
        <textarea v-model="text" class="input" rows="3" :placeholder="placeholder" />
        <div class="flex flex-wrap gap-2">
            <slot name="actions" />
            <Button type="submit" variant="primary" :pending="pending" :disabled="pending">{{ sendLabel }}</Button>
        </div>
        <slot name="after" />
        <FormErrors :errors="errors" />
    </form>
</template>
