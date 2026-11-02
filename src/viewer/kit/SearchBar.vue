<script setup>
import {ref, useSlots} from "vue";
import Icon from "../src/kit/Icon.vue";
import MenuPanel from "../src/kit/MenuPanel.vue";

// one window's search: a field and, flush against it behind a divider, the button of the window's options; a window's own buttons sit beside it
defineProps({modelValue: {type: String, default: ""}, placeholder: {type: String, default: "Search"}});
const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();
const field = ref(null);
const anchor = ref(null);
const toggleMenu = (event) => (anchor.value = anchor.value ? null : event.currentTarget);

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
            <input ref="field" class="search-bar-input" type="text" data-search-input :value="modelValue" :placeholder="placeholder" :aria-label="placeholder" @input="emit('update:modelValue', $event.target.value)" @keydown.esc="clear">
            <template v-if="modelValue">
                <button type="button" class="search-bar-clear" data-search-clear aria-label="Clear the search" @click="clear"><Icon name="close" :size="12" /></button>
            </template>
            <template v-if="slots.menu">
                <button type="button" class="search-bar-menu" data-search-menu aria-label="Options" title="Options" :aria-expanded="Boolean(anchor)" @click="toggleMenu"><Icon name="caret" :size="12" /></button>
            </template>
        </div>
        <slot />
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" align="end" :min-width="220" :max-width="320" @click.stop @close="anchor = null">
                <slot name="menu" />
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.search-bar {
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;
    min-width: 0;
}

.search-bar-control {
    display: flex;
    flex: 1;
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

.search-bar-clear:hover,
.search-bar-menu:hover {
    color: var(--text);
}

.search-bar-menu:hover {
    background: var(--hover);
}
</style>
