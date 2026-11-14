<script setup>
// the memories of one agent inside a list of several: the agent's name, which opens its own memories, and a line about it
defineProps({name: {type: String, required: true}, facts: {type: String, default: ""}});
defineEmits(["pick"]);
</script>

<template>
    <section class="group" data-memory-group>
        <div class="group-head">
            <button type="button" class="group-link" data-group-link @click="$emit('pick')">{{ name }}</button>
            <small>{{ facts }}</small>
        </div>
        <slot />
    </section>
</template>

<style scoped>
.group-head {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    gap: 8px;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 0 5px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
}

.group-link {
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
}

.group-link:hover {
    color: var(--accent-text);
}

small {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
