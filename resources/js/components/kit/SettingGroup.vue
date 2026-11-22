<script setup lang="ts">
import Card from './Card.vue';

/**
 * A plain Card with the card radius that holds SettingRows: a 1px --line border, bottom margin 18, clipped so the
 * rows' rules stop at its edge. A label names the group for a screen reader.
 */
defineProps<{ label?: string }>();
</script>

<template>
    <Card tone="plain" role="group" :aria-label="label" class="mb-4.5 overflow-hidden p-0!">
        <slot />
    </Card>
</template>
