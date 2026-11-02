<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
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
        <Btn small data-options title="Options for all windows" @click.stop="open = !open">Options</Btn>
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
