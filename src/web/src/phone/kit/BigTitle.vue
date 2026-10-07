<script setup>
defineProps({title: {type: String, required: true}, sub: {type: String, default: ""}});
</script>

<template>
    <h1 class="big">{{ title }}</h1>
    <template v-if="sub">
        <p class="big-sub">{{ sub }}</p>
    </template>
</template>

<style scoped>
.big {
    margin: 2px 0;
    font-size: 2.125rem;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0.01em;
}

.big-sub {
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 0.9375rem;
}
</style>
