<script setup>
// a choice shown as tiles, each with a label and a hint; mark names the data attribute that finds a tile
defineProps({options: {type: Array, required: true}, mark: {type: String, required: true}});
const picked = defineModel({type: String, required: true});
</script>

<template>
    <div class="tiles">
        <template v-for="option in options" :key="option.key">
            <button type="button" :class="['tile', {picked: picked === option.key}]" v-bind="{[`data-${mark}`]: option.key}" @click="picked = option.key"><b>{{ option.label }}</b><span>{{ option.hint }}</span></button>
        </template>
    </div>
</template>

<style scoped>
.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
}

.tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 11px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--bg);
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.tile b {
    font-size: 12.5px;
    font-weight: 500;
}

.tile span {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.4;
}

.tile.picked {
    border-color: var(--accent);
    background: var(--accent-dim);
}

.tile.picked b {
    color: var(--accent-text);
}
</style>
