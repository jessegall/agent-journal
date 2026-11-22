<script setup lang="ts">
/**
 * A round mark beside a word: 6 px in the default, brand or solid tone, or a hollow 7 px ring. It is hidden from
 * assistive technology; the word beside it carries the meaning.
 */
withDefaults(defineProps<{ tone?: 'default' | 'brand' | 'solid' | 'hollow' }>(), { tone: 'default' });
</script>

<template>
    <span
        aria-hidden="true"
        class="inline-block shrink-0 rounded-full"
        :class="{
            'size-1.5 bg-text-4': tone === 'default',
            'size-1.5 bg-brand': tone === 'brand',
            'size-1.5 bg-text-3': tone === 'solid',
            'size-1.75 border-[1.5px] border-text-4 bg-transparent': tone === 'hollow',
        }"
    />
</template>
