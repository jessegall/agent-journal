<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import ChoiceList from "../kit/ChoiceList.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {useOutside} from "../composables/outside.js";
import {go, route} from "../route.js";

const props = defineProps({
    pane: {type: Number, required: true},
    anchor: {type: Object, default: null},
    title: {type: String, default: ""},
    others: {type: Array, default: () => []},
    splittable: Boolean,
    closable: Boolean,
    floating: Boolean,
    all: {type: Object, default: null},
    width: {type: String, default: ""},
    schemes: {type: Array, default: () => []},
    flushable: Boolean,
    flush: Boolean,
});
const emit = defineEmits(["close", "split", "move", "float", "shut", "reset", "dock", "away", "unfloat", "width", "scheme", "flush"]);
const menu = ref(null);
const list = ref("");
const mode = computed(() => list.value || (props.floating ? "floating" : "pane"));
useOutside(menu, () => emit("close"));

function openAll() {
    emit("close");
    go(route.value.env, props.all.page);
}

function pick(event, ...args) {
    const pane = props.pane;
    emit("close");
    emit(event, pane, ...args);
}
</script>

<template>
    <MenuPanel ref="menu" :anchor="anchor" :min-width="200" :max-width="280" @click.stop @close="emit('close')">
        <SwitchCase :value="mode">
            <template #move>
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
            <template #schemes>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Colour scheme
                </MenuItem>
                <ChoiceList :choices="schemes" @pick="(key) => pick('scheme', key)" />
            </template>
            <template #floating>
                <MenuItem @click="pick('dock')">
                    <Icon name="dock" :size="14" />
                    Dock
                </MenuItem>
                <MenuItem @click="pick('away')">
                    <Icon name="open" :size="14" />
                    Open in another tab
                </MenuItem>
                <span class="pane-menu-line" />
                <MenuItem @click="pick('unfloat')">
                    <Icon name="x" :size="14" />
                    Close window
                </MenuItem>
            </template>
            <template #default>
                <MenuItem data-step="split" :disabled="!splittable" @click="pick('split', 'right')">
                    <Icon name="columns" :size="14" />
                    Split right
                </MenuItem>
                <MenuItem data-step="split" :disabled="!splittable" @click="pick('split', 'bottom')">
                    <Icon name="rows" :size="14" />
                    Split below
                </MenuItem>
                <MenuItem @click="pick('width', width === 'contained' ? 'full' : 'contained')">
                    <Icon :name="width === 'contained' ? 'wide' : 'narrow'" :size="14" />
                    {{ width === "contained" ? "Fill" : "Contain" }}
                </MenuItem>
                <MenuItem :disabled="!others.length || !title" @click="list = 'move'">
                    <Icon name="arrow" :size="14" />
                    Move to…
                    <span class="pane-menu-more">›</span>
                </MenuItem>
                <MenuItem data-step="detach" :disabled="!title" @click="pick('float')">
                    <Icon name="float" :size="14" />
                    Detach
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
        </SwitchCase>
        <template v-if="!list && (all || schemes.length || flushable)">
            <span class="pane-menu-line" />
            <template v-if="flushable">
                <MenuItem @click="pick('flush', !flush)">
                    <Icon :name="flush ? 'narrow' : 'wide'" :size="14" />
                    {{ flush ? "Inset" : "Flush" }}
                </MenuItem>
            </template>
            <template v-if="schemes.length">
                <MenuItem @click="list = 'schemes'">
                    <Icon name="palette" :size="14" />
                    Colour scheme
                    <span class="pane-menu-more">›</span>
                </MenuItem>
            </template>
            <template v-if="all">
                <MenuItem @click="openAll">
                    <Icon name="open" :size="14" />
                    {{ all.label }}
                </MenuItem>
            </template>
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
