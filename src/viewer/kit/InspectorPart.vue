<script setup>
// a part of an inspector with its heading, in the look of the inspector's own parts, so a section a module adds needs no styles of its own
defineProps({title: {type: String, required: true}});
</script>

<template>
    <section class="inspector-part">
        <h4 class="inspector-part-title">{{ title }}</h4>
        <slot />
    </section>
</template>

<style scoped>
.inspector-part {
    margin-bottom: 18px;
    padding: 0 16px;
    color: var(--text-2);
    font-size: 13px;
}

.inspector-part-title {
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}
</style>
