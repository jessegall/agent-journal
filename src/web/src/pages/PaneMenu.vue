<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {useOutside} from "../composables/outside.js";

const props = defineProps({
    pane: {type: Number, required: true},
    anchor: {type: Object, default: null},
    title: {type: String, default: ""},
    others: {type: Array, default: () => []},
    splittable: Boolean,
    closable: Boolean,
});
const emit = defineEmits(["close", "split", "move", "shut", "reset"]);
const menu = ref(null);
const list = ref("");
useOutside(menu, () => emit("close"));

function pick(event, ...args) {
    const pane = props.pane;
    emit("close");
    emit(event, pane, ...args);
}
</script>

<template>
    <MenuPanel ref="menu" :anchor="anchor" :min-width="200" :max-width="280" @click.stop @close="emit('close')">
        <template v-if="list === 'move'">
            <MenuItem class="pane-menu-back" @click="list = ''">
                <Icon name="back" :size="14" />
                Move {{ title }} to
            </MenuItem>
            <template v-for="o in others" :key="o.id">
                <MenuItem @click="pick('move', o.id)">
                    <Icon :name="o.icon" :size="14" />
                    {{ o.label }}
                </MenuItem>
            </template>
        </template>
        <template v-else>
            <MenuItem :disabled="!splittable" @click="pick('split', 'right')">
                <Icon name="columns" :size="14" />
                Split right
            </MenuItem>
            <MenuItem :disabled="!splittable" @click="pick('split', 'bottom')">
                <Icon name="rows" :size="14" />
                Split below
            </MenuItem>
            <MenuItem :disabled="!others.length || !title" @click="list = 'move'">
                <Icon name="arrow" :size="14" />
                Move to…
                <span class="pane-menu-more">›</span>
            </MenuItem>
            <span class="pane-menu-line" />
            <MenuItem :disabled="!closable" @click="pick('shut')">
                <Icon name="x" :size="14" />
                Close
            </MenuItem>
            <MenuItem @click="pick('reset')">
                <Icon name="restore" :size="14" />
                Reset layout
            </MenuItem>
        </template>
    </MenuPanel>
</template>

<style scoped>
.pane-menu-more {
    margin-left: auto;
    color: var(--text-4);
}

.pane-menu-back {
    color: var(--text-3);
}

.pane-menu-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}
</style>
