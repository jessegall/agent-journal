<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import Button from './Button.vue';

/**
 * The floating primary sm button that opens a comment on the selected lines. It is placed at the end of the selection
 * (top and left, from its container's edge) and goes away when anything scrolls: it emits dismiss. It follows the
 * selection in the tab order, so after a keyboard selection Tab reaches it; focus() puts the focus on it.
 */
defineProps<{ top: number; left: number }>();

const emit = defineEmits<{ comment: []; dismiss: [] }>();

const root = useTemplateRef<HTMLElement>('root');
const dismiss = () => emit('dismiss');

onMounted(() => window.addEventListener('scroll', dismiss, true));
onBeforeUnmount(() => window.removeEventListener('scroll', dismiss, true));

defineExpose({ focus: () => root.value?.querySelector('button')?.focus() });
</script>

<template>
    <div ref="root" class="absolute z-10" :style="{ top: `${top}px`, left: `${left}px` }">
        <Button variant="primary" size="sm" aria-label="Comment on the selected lines" @click="emit('comment')">
            Comment
        </Button>
    </div>
</template>
