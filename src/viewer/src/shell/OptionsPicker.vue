<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {chooseColorScheme, colorScheme, SCHEMES} from "../windows/colorScheme.js";

// the options that apply to all windows, beside the layout presets
const open = ref(false);
const opener = ref(null);
</script>

<template>
    <span ref="opener">
        <Btn kind="icon" data-options title="Options" aria-label="Options" @click.stop="open = !open"><Icon name="settings" :size="13" /></Btn>
    </span>
    <template v-if="open">
        <MenuPanel :anchor="opener" align="end" :min-width="200" @click.stop @close="open = false">
            <MenuLabel>Color scheme</MenuLabel>
            <template v-for="scheme in SCHEMES" :key="scheme.key">
                <MenuItem :on="colorScheme === scheme.key" :data-scheme="scheme.key" @click="chooseColorScheme(scheme.key)">{{ scheme.label }}</MenuItem>
            </template>
        </MenuPanel>
    </template>
</template>
