<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import type { DurationNode } from '@kit/dockCards';
import { elapsed } from '../elapsed';

/**
 * How long something ran: counted here each second while it runs, fixed at its finish.
 */
const props = defineProps<{ node: DurationNode }>();

const now = ref(Date.now());
const timer = props.node.finishedAt === null ? window.setInterval(() => (now.value = Date.now()), 1000) : undefined;
const text = computed(() => {
    const end = props.node.finishedAt === null ? now.value : Date.parse(props.node.finishedAt);

    return elapsed(end - Date.parse(props.node.startedAt));
});

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
    <span class="text-small text-text-3 tabular-nums">{{ text }}</span>
</template>
