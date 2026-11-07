<script setup>
import {computed, inject, ref, useSlots} from "vue";
import Icon from "../src/kit/Icon.vue";
import MenuItem from "../src/kit/MenuItem.vue";
import MenuPanel from "../src/kit/MenuPanel.vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

// one window's search: a field and, flush against it behind a divider, the button of the window's options; a window's own buttons sit beside it.
// When the window declares its search, the declaration gives the placeholder, the entries of the options menu (an entry opens a menu or sends
// its click key to the window as pick) and a standalone button beside the field, which sends its click key the same way
const props = defineProps({modelValue: {type: String, default: ""}, placeholder: {type: String, default: "Search"}, menuCount: {type: Number, default: 0}});
const emit = defineEmits(["update:modelValue", "pick"]);
const slots = useSlots();
const declared = inject(WINDOW_CONTEXT, null)?.search ?? {};
const hint = computed(() => declared.placeholder || props.placeholder);
const entries = declared.context ?? [];
const field = ref(null);
const anchor = ref(null);
const trail = ref([]);
const level = computed(() => trail.value.length ? trail.value[trail.value.length - 1].next : entries);
const hasMenu = computed(() => Boolean(slots.menu) || entries.length > 0);
const toggleMenu = (event) => {
    trail.value = [];
    anchor.value = anchor.value ? null : event.currentTarget;
};

function choose(entry) {
    if (entry.next.length) {
        trail.value = [...trail.value, entry];
        return;
    }
    anchor.value = null;
    emit("pick", entry.click);
}

function clear() {
    emit("update:modelValue", "");
    field.value?.focus();
}

defineExpose({focus: () => field.value?.focus()});
</script>

<template>
    <div class="search-bar" data-search-bar>
        <div class="search-bar-control">
            <Icon class="search-bar-icon" name="search" :size="14" />
            <input ref="field" class="search-bar-input" type="text" data-search-input :value="modelValue" :placeholder="hint" :aria-label="hint" @input="emit('update:modelValue', $event.target.value)" @keydown.esc="clear">
            <template v-if="modelValue">
                <button type="button" class="search-bar-clear" data-search-clear aria-label="Clear the search" @click="clear"><Icon name="close" :size="12" /></button>
            </template>
            <template v-if="hasMenu">
                <button type="button" class="search-bar-menu" data-search-menu aria-label="Options" title="Options" :aria-expanded="Boolean(anchor)" @click="toggleMenu"><template v-if="menuCount"><span data-menu-count>{{ menuCount }}</span></template><Icon name="caret" :size="12" /></button>
            </template>
        </div>
        <template v-if="declared.button?.title">
            <button type="button" class="search-bar-button" data-search-button @click="emit('pick', declared.button.click)">{{ declared.button.title }}</button>
        </template>
        <slot />
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" align="end" :min-width="220" :max-width="320" @click.stop @close="anchor = null">
                <template v-if="trail.length">
                    <MenuItem data-search-back @click="trail = trail.slice(0, -1)">‹ {{ trail[trail.length - 1].title }}</MenuItem>
                </template>
                <template v-for="entry in level" :key="entry.title">
                    <MenuItem :description="entry.subtext" :data-search-entry="entry.title" @click="choose(entry)">{{ entry.title }}{{ entry.next.length ? " ›" : "" }}</MenuItem>
                </template>
                <template v-if="!trail.length">
                    <slot name="menu" />
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.search-bar {
    position: sticky;
    z-index: 4;
    top: 0;
    display: flex;
    flex: none;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    min-width: 0;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
}

.search-bar-control {
    display: flex;
    flex: 1 1 200px;
    align-items: stretch;
    min-width: 0;
    height: 30px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--surface);
}

.search-bar-control:focus-within {
    border-color: var(--accent);
}

.search-bar-icon {
    flex: none;
    align-self: center;
    margin-left: 9px;
    color: var(--text-3);
}

.search-bar-input {
    flex: 1;
    min-width: 0;
    padding: 0 8px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.search-bar-clear,
.search-bar-menu {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 28px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.search-bar-menu {
    border-left: 1px solid var(--border-2);
    border-radius: 0 5px 5px 0;
}

.search-bar-button {
    flex: none;
    height: 30px;
    padding: 0 12px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.search-bar-button:hover {
    background: var(--hover);
    color: var(--text);
}

.search-bar-clear:hover,
.search-bar-menu:hover {
    color: var(--text);
}

.search-bar-menu:hover {
    background: var(--hover);
}
</style>
