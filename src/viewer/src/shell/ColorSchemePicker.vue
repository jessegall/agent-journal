<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuLabel from "../kit/MenuLabel.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import {chooseColorScheme, colorScheme, SCHEMES} from "../windows/colorScheme.js";

// the button of the top bar that chooses light, dark or following the system
const open = ref(false);
const opener = ref(null);
</script>

<template>
    <span ref="opener" class="scheme-opener">
        <Btn variant="icon" data-color-scheme title="Color scheme" aria-label="Color scheme" @click.stop="open = !open"><Icon name="scheme" :size="13" /></Btn>
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

<style scoped>
.scheme-opener {
    display: inline-flex;
}
</style>
