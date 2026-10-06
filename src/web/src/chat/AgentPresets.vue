<script setup>
import {inject} from "vue";
import ChoiceList from "../kit/ChoiceList.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuSlide from "../kit/MenuSlide.vue";
import PresetList from "../kit/PresetList.vue";

const schemesOpen = defineModel("schemesOpen", {type: Boolean, default: false});
const emit = defineEmits(["preset", "scheme"]);
const views = inject("views", null);
</script>

<template>
    <MenuSlide :second="schemesOpen">
        <template #first>
            <PresetList
                :presets="views.presets.value"
                savable
                @pick="(key) => emit('preset', key)"
                @save="views.saveLayout"
                @rename="views.renamePreset"
                @update="views.updatePreset"
                @remove="views.removePreset"
                :link-for="views.linkPreset"
                :read-link="views.readLayoutLink"
                @share="views.sharePreset"
                @import="views.importPreset"
            />
            <span class="bar-line" />
            <MenuItem @click="schemesOpen = true">
                <Icon name="palette" :size="14" />
                Color schemes
                <span class="bar-more">›</span>
            </MenuItem>
        </template>
        <template #second>
            <MenuItem class="bar-back" @click="schemesOpen = false">
                <Icon name="back" :size="14" />
                Color schemes
            </MenuItem>
            <ChoiceList :choices="views.schemes.value" @pick="(key) => emit('scheme', key)" />
        </template>
    </MenuSlide>
</template>

<style scoped>
.bar-line {
    height: 1px;
    margin: 4px 2px;
    background: var(--border);
}

.bar-more {
    margin-left: auto;
    color: var(--text-4);
}

.bar-back {
    color: var(--text-3);
}
</style>
