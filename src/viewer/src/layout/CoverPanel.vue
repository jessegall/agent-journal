<script setup>
import Spinner from "../kit/Spinner.vue";

defineProps({
    label: {type: String, required: true},
    title: {type: String, required: true},
    step: {type: String, required: true},
    spinning: {type: Boolean, default: true},
    busy: {type: Boolean, default: false},
});
</script>

<template>
    <div class="cover" role="alertdialog" aria-live="polite" :aria-label="label" :aria-busy="busy ? 'true' : null">
        <div class="panel">
            <template v-if="spinning">
                <Spinner :size="22" class="spin" />
            </template>
            <p class="title">{{ title }}</p>
            <p class="step">{{ step }}</p>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.cover {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
    box-shadow: inset 0 0 120px color-mix(in srgb, var(--accent) 22%, transparent);
    cursor: progress;
    touch-action: none;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    width: min(300px, calc(100vw - 32px));
    height: 150px;
    padding: 22px 28px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: var(--tip-shadow);
    text-align: center;
}

.spin {
    margin-bottom: 6px;
    color: var(--accent-text);
}

.title {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.step {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}
</style>
