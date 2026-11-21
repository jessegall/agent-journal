<script setup lang="ts">
import { componentNamed } from '@/framework/manifestComponents';
import WindowHost from '@/framework/WindowHost.vue';
import type { SlotSectionData } from '@/generated/types/core';

/**
 * The sections other domains put in one slot of a page, each loaded by its component name and fed by its own prop.
 */
defineProps<{ sections: SlotSectionData[] }>();
</script>

<template>
    <template v-for="section in sections" :key="section.propName">
        <WindowHost :component="componentNamed(section.component)" :prop-name="section.propName" />
    </template>
</template>
