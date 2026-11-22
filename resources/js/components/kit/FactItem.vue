<script setup lang="ts">
/**
 * One fact in a FactList: the term in --text-3 and its value in --text-2 from the slot. An empty value is written
 * by the caller ("Nobody yet" or "nothing"), never left blank.
 */
defineProps<{ term: string }>();
</script>

<template>
    <div class="contents">
        <dt class="text-text-3">{{ term }}</dt>
        <dd class="m-0 text-text-2 [overflow-wrap:anywhere]"><slot /></dd>
    </div>
</template>
