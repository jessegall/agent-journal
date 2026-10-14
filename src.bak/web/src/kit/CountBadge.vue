<script setup>
defineProps({count: {type: [Number, String], required: true}});
</script>

<template>
    <span class="count-badge">{{ count }}</span>
</template>

<style scoped>
.count-badge {
    position: absolute;
    top: -2px;
    right: -3px;
    min-width: 15px;
    height: 15px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    line-height: 15px;
    text-align: center;
    pointer-events: none;
}
</style>
