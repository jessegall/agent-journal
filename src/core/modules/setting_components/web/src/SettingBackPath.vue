<script setup>
// where a screen below another is: the screen above it, which goes back when pressed, and the screen shown
defineProps({parent: {type: String, required: true}, current: {type: String, required: true}});
const emit = defineEmits(["back"]);
</script>

<template>
    <nav class="setting-back-path" aria-label="Where you are">
        <a href="#" data-back @click.prevent="emit('back')">{{ parent }}</a>
        <span aria-hidden="true">/</span>
        <b>{{ current }}</b>
    </nav>
</template>

<style scoped>
.setting-back-path { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 22px; border-bottom: 1px solid var(--border); color: var(--text-3); font-size: 12.5px; }
a { color: var(--accent-text); text-decoration: none; }
b { color: var(--text); font-weight: 500; }
</style>
