<script setup>
defineProps({newer: {type: Boolean, default: false}});
const emit = defineEmits(["reload"]);
</script>

<template>
    <template v-if="newer">
        <p class="update-band" role="status">
            A newer version of this app is ready.
            <button type="button" @click="emit('reload')">Reload now</button>
        </p>
    </template>
</template>

<style scoped>
.update-band {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 6px 0 8px;
    padding: 6px 6px 6px 14px;
    border-radius: 18px;
    background: var(--accent-dim);
    color: var(--text);
    font-size: 0.8125rem;
    line-height: 1.3;
}

.update-band button {
    flex: none;
    min-height: 44px;
    padding: 0 14px;
    border: 0;
    border-radius: 22px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}
</style>
