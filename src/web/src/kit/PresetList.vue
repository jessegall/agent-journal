<script setup>
import LayoutThumb from "./LayoutThumb.vue";
import MenuItem from "./MenuItem.vue";

defineProps({presets: {type: Array, required: true}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <template v-for="p in presets" :key="p.key">
        <MenuItem class="preset" @click="emit('pick', p.key)">
            <LayoutThumb :cells="p.cells" />
            <span class="preset-body">
                <span class="preset-name">{{ p.name }}</span>
                <span class="preset-text">{{ p.text }}</span>
            </span>
            <template v-if="p.current">
                <span class="preset-current">Current</span>
            </template>
        </MenuItem>
    </template>
</template>

<style scoped>
.preset {
    gap: 11px;
    padding: 6px 8px;
}

.preset-body {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
}

.preset-name {
    color: var(--text);
    font-size: 12.5px;
}

.preset-text {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.35;
    text-wrap: pretty;
}

.preset-current {
    flex: none;
    color: var(--accent-text);
    font-size: 11.5px;
}
</style>
