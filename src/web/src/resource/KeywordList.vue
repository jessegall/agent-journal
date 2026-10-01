<script setup>
defineProps({words: {type: Array, required: true}});
</script>

<template>
    <div class="keywords">
        <template v-for="word in words" :key="word">
            <span class="keyword">{{ word }}</span>
        </template>
    </div>
</template>

<style scoped>
.keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.keyword {
    padding: 2px 8px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
}
</style>
