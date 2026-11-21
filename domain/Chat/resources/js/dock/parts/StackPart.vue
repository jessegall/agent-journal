<script setup lang="ts">
import type { StackNode } from '@kit/dockCards';
import DockPart from '../DockPart.vue';

/**
 * Parts one under another, in order.
 */
defineProps<{ node: StackNode; path: string }>();
</script>

<template>
    <div class="flex flex-col gap-1">
        <template v-for="child in node.children" :key="child.key">
            <DockPart
                :node="child"
                :path="`${path}/${child.key}`"
            />
        </template>
    </div>
</template>
