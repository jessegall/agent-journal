<script setup lang="ts">
import Button from './Button.vue';
import GroupLabel from './GroupLabel.vue';
import Toggle from './Toggle.vue';

/**
 * The head of a SettingsSection: the GroupLabel (its title in the slot), a sm Reset button that shows only once a
 * setting changed, and, when a switch label is given, a Toggle that turns the whole section on or off.
 */
defineProps<{ changed?: boolean; switchLabel?: string }>();

defineEmits<{ reset: [] }>();

const enabled = defineModel<boolean>('enabled', { default: true });
</script>

<template>
    <div class="flex items-center justify-between gap-3">
        <GroupLabel><slot /></GroupLabel>
        <div class="flex items-center gap-2">
            <Button v-if="changed" size="sm" @click="$emit('reset')">Reset</Button>
            <Toggle v-if="switchLabel" v-model="enabled" :label="switchLabel" />
        </div>
    </div>
</template>
