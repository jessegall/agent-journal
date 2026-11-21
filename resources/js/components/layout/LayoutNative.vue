<script setup lang="ts">
import { componentNamed } from '@/framework/manifestComponents';
import type { LayoutPartData } from '@/generated/types/core';

// A native part of a declared layout: the registered component it names, fed by the typed props its reader built;
// it mounts with its part and goes with it, so a tab change or a new record starts it afresh.
defineProps<{ part: LayoutPartData }>();
</script>

<template>
    <template v-if="part.native">
        <component
            :is="componentNamed(part.native.component)"
            v-bind="part.native.props"
        />
    </template>
</template>
