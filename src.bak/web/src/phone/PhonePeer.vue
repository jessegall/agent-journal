<script setup>
defineProps({label: {type: String, required: true}});
</script>

<template>
    <span class="turn-peer-head">{{ label }}</span>
</template>

<style scoped>
.turn-peer-head {
    display: block;
    margin-bottom: 2px;
    padding-right: 26px;
    color: var(--text-2);
    font-size: 0.706rem;
    font-weight: 600;
}
</style>
