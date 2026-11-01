<script setup>
// the path at the top of the page as version 4 drew it: the project's swatch, the project, the environment and the page
defineProps({environment: {type: String, required: true}, page: {type: String, default: "Home"}});
</script>

<template>
    <nav class="breadcrumb" data-breadcrumb aria-label="Where you are">
        <span class="crumb-swatch" />
        <span class="crumb">agent-journal</span>
        <span class="crumb-sep">/</span>
        <span class="crumb">{{ environment }}</span>
        <span class="crumb-sep">/</span>
        <span class="crumb current">{{ page }}</span>
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
