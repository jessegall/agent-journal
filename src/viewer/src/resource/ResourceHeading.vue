<script setup>
defineProps({title: String, abstract: String});
</script>

<template>
    <div class="resource-heading">
        <template v-if="title">
            <h2 class="resource-title" data-resource-title>{{ title }}</h2>
        </template>
        <template v-if="abstract">
            <p class="resource-abstract">{{ abstract }}</p>
        </template>
    </div>
</template>

<style scoped>
.resource-heading {
    flex: 1;
    min-width: 0;
}

.resource-title {
    margin: 6px 0 0;
    padding-right: var(--s2);
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
}

.resource-abstract {
    margin: 4px 0 0;
    padding-right: var(--s2);
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
