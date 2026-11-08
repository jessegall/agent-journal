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
</style>
