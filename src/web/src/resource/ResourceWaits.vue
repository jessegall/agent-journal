<script setup>
defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <p class="waits">
        <template v-if="resource.blocked_why">Blocked: {{ resource.blocked_why }}</template>
        <template v-if="resource.parked_why">Parked: {{ resource.parked_why }}</template>
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
