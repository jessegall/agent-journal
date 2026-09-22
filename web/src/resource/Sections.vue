<script setup>
import TextDisplay from "../kit/TextDisplay.vue";

defineProps({sections: Array});
</script>

<template>
    <template v-for="s in sections" :key="s.title">
        <section class="section">
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
</style>
