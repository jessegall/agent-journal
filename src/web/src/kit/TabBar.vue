<script setup>
defineProps({tabs: {type: Array, required: true}});
const chosen = defineModel({type: String, required: true});
</script>

<template>
    <div class="tabs" role="tablist">
        <template v-for="tab in tabs" :key="tab.key">
            <button
                type="button"
                role="tab"
                :aria-selected="chosen === tab.key"
                :class="['tab', {on: chosen === tab.key}]"
                @click="chosen = tab.key"
            >
                {{ tab.title }}
                <template v-if="tab.count !== undefined">
                    <span class="tab-n">{{ tab.count }}</span>
                </template>
            </button>
        </template>
        <slot />
    </div>
</template>

<style scoped>
.tabs {
    display: flex;
    align-items: stretch;
    gap: 14px;
}

.tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
}

.tab:hover {
    color: var(--text-2);
}

.tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.tab.on .tab-n {
    color: var(--accent-text);
}
</style>
