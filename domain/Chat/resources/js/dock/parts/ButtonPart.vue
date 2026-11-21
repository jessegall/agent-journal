<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { ButtonNode } from '@kit/dockCards';

/**
 * A button its owner declared: it opens a page, which checks the viewer's access as it opens.
 */
const props = defineProps<{ node: ButtonNode }>();

const emphases: Record<ButtonNode['emphasis'], string> = {
    primary: 'bg-brand text-white',
    secondary: 'border border-border-2 text-text-2',
    quiet: 'text-text-3 underline',
};

function press(): void {
    if (props.node.target !== null) {
        router.visit(props.node.target.href);
    }
}
</script>

<template>
    <button type="button" class="w-fit rounded-control px-2 py-0.5 text-small" :class="emphases[node.emphasis]" @click="press">
        {{ node.label }}
    </button>
</template>
