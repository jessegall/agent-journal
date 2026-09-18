<script setup>
defineProps({sections: Array});
</script>

<template>
    <template v-for="s in sections" :key="s.title">
        <section class="section">
            <h3>{{ s.title }}</h3>
            <div class="text">{{ s.body }}</div>
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
.text {
    white-space: pre-wrap;
    color: var(--text-2);
}
</style>
