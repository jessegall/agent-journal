<script setup>
import {onUnmounted, ref} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    label: {type: String, default: ""},
    icon: {type: String, default: ""},
    items: {type: Array, default: () => []},
    picked: {type: String, default: ""},
    empty: {type: String, default: "Nothing here"},
});
const emit = defineEmits(["pick"]);
const open = ref(false);
const root = ref(null);

function away(e) {
    if (root.value && !root.value.contains(e.target)) open.value = false;
}

function toggle() {
    open.value = !open.value;
    if (open.value) document.addEventListener("click", away, true);
    else document.removeEventListener("click", away, true);
}

function choose(item) {
    open.value = false;
    document.removeEventListener("click", away, true);
    emit("pick", item);
}

onUnmounted(() => document.removeEventListener("click", away, true));
</script>

<template>
    <div ref="root" class="drop">
        <button type="button" :class="['drop-head', {on: open}]" :aria-expanded="open" @click="toggle">
            <template v-if="icon">
                <Icon :name="icon" :size="12" />
            </template>
            <span class="drop-label">{{ label }}</span>
            <Icon name="chevron" :size="11" />
        </button>
        <template v-if="open">
            <div class="drop-list">
                <template v-for="item in items" :key="item.key">
                    <button type="button" :class="['drop-item', {on: item.key === picked}]" @click="choose(item)">
                        <template v-if="item.running !== undefined">
                            <span :class="['drop-dot', {live: item.running}]" />
                        </template>
                        <span class="drop-item-text">{{ item.label }}</span>
                        <template v-if="item.note">
                            <span class="drop-note">{{ item.note }}</span>
                        </template>
                    </button>
                </template>
                <template v-if="!items.length">
                    <p class="drop-none">{{ empty }}</p>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.drop {
    position: relative;
    display: inline-flex;
}

.drop-head {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 320px;
    height: 26px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.drop-head:hover,
.drop-head.on {
    border-color: var(--accent);
    color: var(--text);
}

.drop-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.drop-list {
    position: absolute;
    z-index: 40;
    top: 30px;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 260px;
    max-height: 320px;
    overflow-y: auto;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
}

.drop-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.drop-item:hover {
    background: var(--hover);
    color: var(--text);
}

.drop-item.on {
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    color: var(--text);
}

.drop-item-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.drop-note {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}

.drop-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-4);
}

.drop-dot.live {
    background: var(--accent-text);
}

.drop-none {
    margin: 0;
    padding: 6px 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>
