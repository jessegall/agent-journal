<script setup>
// what a list says while it has nothing in it: a short title and one line of what makes something appear
defineProps({title: {type: String, required: true}, line: {type: String, default: ""}});
</script>

<template>
    <div class="setting-empty">
        <strong>{{ title }}</strong>
        <template v-if="line">
            <p>{{ line }}</p>
        </template>
    </div>
</template>

<style scoped>
.setting-empty { padding: 14px 0; color: var(--text-3); font-size: 12px; }
strong { color: var(--text); font-size: 12.5px; font-weight: 500; }
p { margin: 4px 0 0; }
</style>
