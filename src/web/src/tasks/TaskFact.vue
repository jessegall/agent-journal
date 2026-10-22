<script setup>
defineProps({label: {type: String, required: true}});
</script>

<template>
    <div class="fact">
        <span class="label">{{ label }}</span>
        <span class="value"><slot /></span>
    </div>
</template>

<style scoped>
.fact {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.label {
    color: var(--text-4);
    font-size: 11.5px;
}

.value {
    font-size: 12.5px;
}
</style>
