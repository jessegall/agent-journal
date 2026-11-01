<script setup>
// the path at the top of the page as version 4 drew it: the project's swatch, the project, the environment and the page
defineProps({environment: {type: String, required: true}, page: {type: String, default: "Home"}, helpers: {type: Number, default: null}});
defineEmits(["open"]);
</script>

<template>
    <nav class="breadcrumb" data-breadcrumb aria-label="Where you are">
        <span class="crumb-swatch" />
        <span class="crumb">agent-journal</span>
        <span class="crumb-sep">/</span>
        <span class="crumb">{{ environment }}</span>
        <span class="crumb-sep">/</span>
        <span class="crumb current">{{ page }}</span>
        <span class="crumb-space" />
        <template v-if="helpers !== null">
            <button type="button" class="crumb-helpers" data-helpers title="Helpers running" @click="$emit('open', 'helpers')">
                {{ helpers }} {{ helpers === 1 ? "helper" : "helpers" }}
            </button>
        </template>
        <slot />
    </nav>
</template>

<style scoped>
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
    font-size: 13px;
}

.crumb-space {
    flex: 1;
}

.crumb-helpers {
    padding: 3px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.crumb-helpers:hover {
    background: var(--hover);
    color: var(--text);
}

.crumb-swatch {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: var(--accent);
}

.crumb-sep {
    color: var(--text-4);
}

.crumb.current {
    color: var(--text);
    font-weight: 500;
}
</style>
