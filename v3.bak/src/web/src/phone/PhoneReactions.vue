<script setup>
defineProps({faces: {type: Array, default: () => []}});
</script>

<template>
    <span :key="faces.join('')" class="turn-faces">{{ faces.join(" ") }}</span>
</template>

<style scoped>
@keyframes face-in-spring {
    from {
        transform: scale(0.5);
        opacity: 0;
    }
}

@keyframes face-in {
    from {
        transform: scale(0.6);
        opacity: 0;
    }
}

.turn-faces {
    animation: face-in-spring 220ms var(--spring);
    display: inline-block;
    margin-top: 6px;
    padding: 1px 7px;
    border-radius: 9px;
    background: var(--bg);
    font-size: 0.824rem;
}
</style>
