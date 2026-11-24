<script setup lang="ts">
import Button from './Button.vue';

/**
 * The two ways on after a change whose outcome is unknown: read the record again to see what happened, or send the
 * same change again under the same key.
 */
defineProps<{ checkLabel: string }>();
const emit = defineEmits<{ check: []; resend: [] }>();
</script>

<template>
    <Button variant="bordered" @click="emit('check')">{{ checkLabel }}</Button>
    <Button variant="bordered" @click="emit('resend')">Send again</Button>
</template>
