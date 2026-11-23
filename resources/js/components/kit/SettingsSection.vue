<script setup lang="ts">
import SectionHead from './SectionHead.vue';

/**
 * One section of a settings page: its SectionHead, a help line (small, --text-3) and the SettingGroups in the slot.
 * The section is a named region. Reset and the section switch pass through to the head. A spoken section stands right
 * under a title of its own page: its title only names the region and no head is drawn.
 */
defineProps<{ title: string; help?: string; changed?: boolean; switchLabel?: string; spoken?: boolean }>();

defineEmits<{ reset: [] }>();

const enabled = defineModel<boolean>('enabled', { default: true });
</script>

<template>
    <section :aria-label="title">
        <template v-if="!spoken">
            <SectionHead
                v-model:enabled="enabled"
                :changed="changed"
                :switch-label="switchLabel"
                @reset="$emit('reset')"
            >
                {{ title }}
                <template #actions><slot name="actions" /></template>
            </SectionHead>
        </template>
        <template v-if="help">
            <p class="-mt-1 mb-2 text-small text-text-3">{{ help }}</p>
        </template>
        <slot />
    </section>
</template>
