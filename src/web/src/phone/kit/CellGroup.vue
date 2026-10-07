<script setup>
defineProps({head: {type: String, default: ""}, line: {type: String, default: ""}, foot: {type: String, default: ""}});
</script>

<template>
    <section class="cell-group" :aria-label="head || undefined">
        <template v-if="head">
            <h2 class="group-head">{{ head }}</h2>
        </template>
        <template v-if="line">
            <p class="group-line">{{ line }}</p>
        </template>
        <div class="group">
            <slot />
        </div>
        <template v-if="foot">
            <p class="group-foot">{{ foot }}</p>
        </template>
    </section>
</template>

<style scoped>
.group-head {
    margin: 22px 4px 7px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}

.cell-group:first-child .group-head {
    margin-top: 6px;
}

.group-line {
    margin: -4px 4px 8px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.group {
    overflow: hidden;
    border-radius: 12px;
    background: var(--raised);
}

.group-foot {
    margin: 7px 4px 0;
    color: var(--text-3);
    font-size: 0.8125rem;
}
</style>
