<script setup lang="ts">
/**
 * Where a guided dialog stands: a short bar per step, the brand colour up to the step shown, named Step 2 of 3 for a
 * screen reader. It sits in a DialogHeader's trailing slot.
 */
defineProps<{ count: number; step: number }>();
</script>

<template>
    <span class="flex items-center gap-1" :aria-label="`Step ${step} of ${count}`">
        <template v-for="bar in count" :key="bar">
            <i
                data-step-bar
                :data-done="bar <= step"
                class="block h-[3px] w-5 rounded-[2px]"
                :class="bar <= step ? 'bg-brand' : 'bg-border-2'"
            />
        </template>
    </span>
</template>
