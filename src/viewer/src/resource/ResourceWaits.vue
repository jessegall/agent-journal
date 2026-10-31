<script setup>
defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <p class="waits">
        <template v-if="resource.block_reason">Blocked: {{ resource.block_reason }}</template>
        <template v-if="resource.pause_reason">Set aside: {{ resource.pause_reason }}</template>
    </p>
</template>

<style scoped>
.wait {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.waits {
    margin: 10px 0 0;
    color: var(--blocking);
    font-size: 12.5px;
}
</style>
