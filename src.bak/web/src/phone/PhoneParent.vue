<script setup>
defineProps({target: {type: String, required: true}, label: {type: String, required: true}});
</script>

<template>
    <a class="turn-about" href="#" :data-peek="target">on {{ label }}</a>
</template>

<style scoped>
.turn-about {
    display: inline-block;
    margin-bottom: 4px;
    color: var(--accent-text);
    font-size: 0.706rem;
    text-decoration: none;
}
</style>
