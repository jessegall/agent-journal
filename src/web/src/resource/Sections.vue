<script setup>
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({sections: Array, document: Boolean});
</script>

<template>
    <template v-for="s in sections" :key="s.title">
        <section :class="['section', {reading: document}]">
            <h3>{{ s.title }}</h3>
            <TextDisplay :text="s.body" />
        </section>
    </template>
</template>

<style scoped>
.section {
    margin-top: 16px;
}

h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
}

.section.reading {
    margin-top: 28px;
    scroll-margin-top: 120px;
}

.section.reading h3 {
    margin-bottom: 8px;
    font-size: 15px;
    letter-spacing: -0.005em;
}
</style>
