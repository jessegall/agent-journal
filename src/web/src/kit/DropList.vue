<script setup>
import MenuItem from "./MenuItem.vue";
import MenuPanel from "./MenuPanel.vue";
import {ref} from "vue";
import Icon from "./Icon.vue";

const props = defineProps({
    label: {type: String, default: ""},
    icon: {type: String, default: ""},
    items: {type: Array, default: () => []},
    picked: {type: String, default: ""},
    empty: {type: String, default: "Nothing here"},
    wide: Boolean,
    bare: Boolean,
    menuWidth: {type: Number, default: 260},
});
const emit = defineEmits(["pick"]);
const open = ref(false);
const head = ref(null);

function choose(item) {
    open.value = false;
    emit("pick", item);
}
</script>

<template>
    <div :class="['drop', {wide, bare}]">
        <button ref="head" type="button" :class="['drop-head', {on: open}]" :aria-expanded="open" @click="open = !open">
            <template v-if="icon">
                <Icon :name="icon" :size="12" />
            </template>
            <span class="drop-label">{{ label }}</span>
            <Icon name="chevron" :size="11" />
        </button>
        <template v-if="open">
            <MenuPanel :anchor="head" :min-width="menuWidth" :max-height="320" @close="open = false">
                <template v-for="item in items" :key="item.key">
                    <MenuItem :on="item.key === picked" @click="choose(item)">
                        <template v-if="item.running !== undefined">
                            <span :class="['drop-dot', {live: item.running}]" />
                        </template>
                        <template v-if="item.lead">
                            <span class="drop-lead">{{ item.lead }}</span>
                        </template>
                        <span class="drop-item-text">{{ item.label }}</span>
                        <template v-if="item.note">
                            <span class="drop-note">{{ item.note }}</span>
                        </template>
                    </MenuItem>
                </template>
                <template v-if="!items.length">
                    <p class="drop-none">{{ empty }}</p>
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.drop {
    position: relative;
    display: inline-flex;
}

.drop.wide {
    display: flex;
}

.drop.bare,
.bare .drop-head {
    height: 100%;
}

.bare .drop-head {
    border: 0;
    border-radius: 0;
    background: none;
    color: var(--text-3);
    padding: 0 10px;
}

.bare .drop-head:hover,
.bare .drop-head.on {
    color: var(--text);
}

.wide .drop-head {
    flex: 1;
    justify-content: space-between;
    max-width: none;
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

.drop-item-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.drop-lead {
    flex: none;
    min-width: 1.2em;
    color: var(--text-4);
    font-variant-numeric: tabular-nums;
    text-align: right;
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
