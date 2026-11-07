<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";

// an option with choices in a menu: one line with what is chosen, which opens an inner menu that slides in with a choice a
// line and a way back, as version 4 has it
const props = defineProps({optionKey: {type: String, required: true}, label: {type: String, required: true}, items: {type: Array, required: true}});
const emit = defineEmits(["pick"]);
const open = ref(false);
const current = computed(() => props.items.find((item) => item.chosen)?.label ?? "");

function pick(item) {
    emit("pick", item);
    open.value = false;
}
</script>

<template>
    <div class="pane-menu-choice pane-menu-inner-row" :data-option="optionKey">
        <MenuLabel>{{ label }}</MenuLabel>
        <button type="button" class="pane-menu-inner-open" data-menu-inner :aria-expanded="open" @click="open = true">
            <span>{{ current }}</span><Icon name="chevron" :size="12" />
        </button>
        <div v-show="open" class="pane-menu-inner" role="menu" data-menu-inner-list>
            <button type="button" class="pane-menu-inner-back" data-menu-back @click="open = false"><Icon class="back-sign" name="chevron" :size="12" /> {{ label }}</button>
            <template v-for="item in items" :key="item.value">
                <MenuItem :data-choice="item.value" :checked="item.chosen" :aria-pressed="item.chosen" @click="pick(item)">{{ item.label }}</MenuItem>
            </template>
        </div>
    </div>
</template>

<style scoped>
.pane-menu-inner-row {
    flex-wrap: nowrap;
    justify-content: space-between;
}

.pane-menu-inner-open {
    display: flex;
    gap: 6px;
    align-items: center;
    min-width: 0;
    padding: 4px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.pane-menu-inner-open:hover {
    color: var(--text);
}

.pane-menu-inner {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 4px;
    overflow-y: auto;
    border-radius: 8px;
    background: var(--raised);
    animation: pane-menu-inner-in var(--move) both;
}

.pane-menu-inner-back {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 6px 8px;
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.back-sign {
    transform: rotate(180deg);
}

.pane-menu-inner-back:hover {
    color: var(--text);
}

@keyframes pane-menu-inner-in {
    from {
        transform: translateX(16px);
        opacity: 0;
    }
}
</style>
