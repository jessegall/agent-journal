<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import PaneMenuLine from "./PaneMenuLine.vue";

const emit = defineEmits(["pick"]);
</script>

<template>
    <MenuItem @click="emit('pick', 'dock')">
        <Icon name="dock" :size="14" />
        Dock
    </MenuItem>
    <MenuItem @click="emit('pick', 'away')">
        <Icon name="open" :size="14" />
        Open in another tab
    </MenuItem>
    <PaneMenuLine />
    <MenuItem @click="emit('pick', 'unfloat')">
        <Icon name="x" :size="14" />
        Close window
    </MenuItem>
</template>
