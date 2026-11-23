<script setup lang="ts">
import SectionHead from './SectionHead.vue';

/**
 * One section of a settings page: its SectionHead, a help line (small, --text-3) and the SettingGroups in the slot.
 * The section is a named region. Reset and the section switch pass through to the head.
 */
defineProps<{ title: string; help?: string; changed?: boolean; switchLabel?: string }>();

defineEmits<{ reset: [] }>();

const enabled = defineModel<boolean>('enabled', { default: true });
</script>

<template>
    <section :aria-label="title">
        <SectionHead v-model:enabled="enabled" :changed="changed" :switch-label="switchLabel" @reset="$emit('reset')">
            {{ title }}
            <template #actions><slot name="actions" /></template>
        </SectionHead>
        <p v-if="help" class="mb-2.5 text-small text-text-3">{{ help }}</p>
        <slot />
    </section>
</template>
