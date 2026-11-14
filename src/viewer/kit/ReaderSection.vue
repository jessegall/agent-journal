<script setup>
// a titled part of a reader, the way an inspector draws its parts (a small grey title, then the body); an end slot holds a count or a button
defineProps({title: {type: String, required: true}});
</script>

<template>
    <section class="reader-section" data-reader-section>
        <h4 class="reader-section-title"><span class="reader-section-name">{{ title }}</span><slot name="end" /></h4>
        <slot />
    </section>
</template>

<style scoped>
.reader-section {
    margin-top: 20px;
}

.reader-section-title {
    display: flex;
    align-items: center;
    gap: var(--s2);
    margin: 0 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
}

.reader-section-name {
    flex: 1;
}
</style>
