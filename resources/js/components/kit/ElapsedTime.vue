<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { elapsed } from '@/kit/format';

/**
 * How long something ran, shared by the dock's cards and the pages: counted here each second while it runs, fixed at
 * its finish.
 */
const props = defineProps<{ startedAt: string; finishedAt: string | null }>();

const now = ref(Date.now());
const timer =
    props.finishedAt === null
        ? window.setInterval(() => (now.value = Date.now()), 1000)
        : undefined;
const text = computed(() => {
    const end =
        props.finishedAt === null ? now.value : Date.parse(props.finishedAt);

    return elapsed(end - Date.parse(props.startedAt));
});

onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
    <span class="text-small text-text-3 tabular-nums">{{ text }}</span>
</template>
