<script setup>
defineProps({lines: {type: Array, default: () => []}});
</script>

<template>
    <template v-if="lines.length">
        <div class="promises">
            <b>What the journal promises</b>
            <ul>
                <template v-for="line in lines" :key="line">
                    <li>{{ line }}</li>
                </template>
            </ul>
        </div>
    </template>
</template>

<style scoped>
.promises {
    margin: 4px 0 12px;
    color: var(--text-2);
    font-size: 12px;
    line-height: 1.5;
}

.promises b {
    color: var(--text-1);
    font-weight: 600;
}

.promises ul {
    margin: 6px 0 0;
    padding-left: 18px;
}

.promises li {
    margin: 0 0 4px;
}
</style>
