<script setup lang="ts">
import type { ChosenAgentData } from '@generated/types/chat';

/**
 * The chosen agent's name, where a bar shows it.
 */
defineProps<{ data: ChosenAgentData }>();
</script>

<template>
    <span>{{ data.label }}</span>
</template>
