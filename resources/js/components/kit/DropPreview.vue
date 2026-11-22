<script setup lang="ts">
import { computed } from 'vue';
import { type Box, type DockedKind, type DropTarget, dropPreviewBox } from './dropPreviewBox';

/**
 * The result of a drop, drawn before it happens: --brand at 10% with a 1px border of --brand at 40%, over the area the
 * drop would take (the share is worked out in dropPreviewBox). Its box moves over 180ms, and at once under reduced
 * motion. It takes no pointer and is hidden from assistive technology.
 */
const props = withDefaults(
    defineProps<{ area: Box; target: DropTarget; scope?: 'pane' | 'home'; kind?: DockedKind }>(),
    { scope: 'pane', kind: 'window' },
);

const place = computed(() => {
    const box = dropPreviewBox(props.area, props.target, props.scope, props.kind);

    return { left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px` };
});
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute z-(--z-drop-preview) border border-brand/40 bg-brand/10 transition-all duration-(--duration-pop) ease-journal motion-reduce:transition-none"
        :style="place"
    />
</template>
