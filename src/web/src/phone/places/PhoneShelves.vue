<script setup>
import {computed} from "vue";
import {LOOSE, onShelf} from "./shelves.js";

const props = defineProps({
    docs: {type: Array, required: true},
    collections: {type: Array, required: true},
    shelf: {type: String, default: ""},
});
const emit = defineEmits(["pick"]);
const shelves = computed(() => [
    {key: "", label: "All", count: props.docs.length},
    ...props.collections.map((one) => ({key: one.ref, label: one.title, count: one.holds.length})),
    {key: LOOSE, label: "Not in a collection", count: props.docs.filter(onShelf(LOOSE, props.collections)).length},
]);
</script>

<template>
    <div class="shelves" role="tablist" aria-label="Collections">
        <template v-for="one in shelves" :key="one.key">
            <button
                type="button"
                role="tab"
                :aria-selected="shelf === one.key"
                :class="['shelf', {on: shelf === one.key}]"
                @click="emit('pick', one.key)"
            >
                <span class="shelf-label">{{ one.label }}</span>
                <em>{{ one.count }}</em>
            </button>
        </template>
    </div>
</template>

<style scoped>
.shelves {
    display: flex;
    gap: 8px;
    margin: 0 calc(-1 * var(--side, 16px)) 14px;
    padding: 0 var(--side, 16px);
    overflow-x: auto;
    scrollbar-width: none;
}

.shelf {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    max-width: 240px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 18px;
    background: var(--raised);
    color: var(--text-2);
    font: inherit;
    font-size: 0.875rem;
}

.shelf-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shelf em {
    color: var(--text-3);
    font-style: normal;
}

.shelf.on {
    border-color: var(--accent);
    background: var(--sel);
    color: var(--accent-text);
}
</style>
