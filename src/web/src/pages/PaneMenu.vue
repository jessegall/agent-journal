<script setup>
import {computed, ref} from "vue";
import Icon from "../kit/Icon.vue";
import LayoutThumb from "../kit/LayoutThumb.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {useOutside} from "../composables/outside.js";

const props = defineProps({
    pane: {type: Number, required: true},
    anchor: {type: Object, default: null},
    title: {type: String, default: ""},
    others: {type: Array, default: () => []},
    splittable: Boolean,
    closable: Boolean,
    floating: Boolean,
    presets: {type: Array, default: () => []},
});
const emit = defineEmits(["close", "split", "move", "float", "shut", "reset", "dock", "away", "unfloat", "preset"]);
const menu = ref(null);
const list = ref("");
const mode = computed(() => (props.floating ? "floating" : list.value || "pane"));
useOutside(menu, () => emit("close"));

function pick(event, ...args) {
    const pane = props.pane;
    emit("close");
    emit(event, pane, ...args);
}
</script>

<template>
    <MenuPanel
        ref="menu"
        :anchor="anchor"
        :min-width="mode === 'presets' ? 280 : 200"
        :max-width="mode === 'presets' ? 320 : 280"
        @click.stop
        @close="emit('close')"
    >
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
            <template #presets>
                <MenuItem class="pane-menu-back" @click="list = ''">
                    <Icon name="back" :size="14" />
                    Presets
                </MenuItem>
                <span class="pane-menu-line" />
                <template v-for="p in presets" :key="p.key">
                    <MenuItem class="pane-menu-preset" @click="pick('preset', p.key)">
                        <LayoutThumb :cells="p.cells" />
                        <span class="pane-menu-preset-body">
                            <span class="pane-menu-preset-name">{{ p.name }}</span>
                            <span class="pane-menu-preset-text">{{ p.text }}</span>
                        </span>
                        <template v-if="p.current">
                            <span class="pane-menu-current">Current</span>
                        </template>
                    </MenuItem>
                </template>
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
                <MenuItem :disabled="!others.length || !title" @click="list = 'move'">
                    <Icon name="arrow" :size="14" />
                    Move to…
                    <span class="pane-menu-more">›</span>
                </MenuItem>
                <MenuItem data-step="presets" @click="list = 'presets'">
                    <Icon name="layout" :size="14" />
                    Presets
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

.pane-menu-preset {
    gap: 11px;
    padding: 6px 8px;
}

.pane-menu-preset-body {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
}

.pane-menu-preset-name {
    color: var(--text);
    font-size: 12.5px;
}

.pane-menu-preset-text {
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.35;
    text-wrap: pretty;
}

.pane-menu-current {
    flex: none;
    color: var(--accent-text);
    font-size: 11.5px;
}

.pane-menu-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}
</style>
