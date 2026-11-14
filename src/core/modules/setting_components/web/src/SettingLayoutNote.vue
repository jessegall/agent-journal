<script setup>
// a line under a setting that names what is set somewhere else: the names with their values, then where to change them
defineProps({entries: {type: Array, required: true}, where: {type: String, default: "They are changed on their own screens."}});
</script>

<template>
    <template v-if="entries.length">
        <p class="setting-layout-note" data-layout-note>
            <template v-for="(entry, place) in entries" :key="entry.name">{{ place ? ", " : "" }}<span class="name">{{ entry.name }}</span> {{ entry.value }}</template>.
            {{ where }}
        </p>
    </template>
</template>

<style scoped>
.setting-layout-note { margin: 8px 0 0; color: var(--text-3); font-size: 12px; line-height: 1.5; text-wrap: pretty; }
.name { color: var(--text-2); }
</style>
