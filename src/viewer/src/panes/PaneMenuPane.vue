<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import PaneMenuLine from "./PaneMenuLine.vue";
import PaneMenuLink from "./PaneMenuLink.vue";

defineProps({
    title: {type: String, default: ""},
    others: {type: Array, required: true},
    splittable: {type: Boolean, default: false},
    closable: {type: Boolean, default: false},
    width: {type: String, default: ""},
    floats: {type: Boolean, default: true},
});
const emit = defineEmits(["pick", "open"]);
</script>

<template>
    <MenuItem data-step="split" :disabled="!splittable" @click="emit('pick', 'split', 'right')">
        <Icon name="columns" :size="14" />
        Split right
    </MenuItem>
    <MenuItem data-step="split" :disabled="!splittable" @click="emit('pick', 'split', 'bottom')">
        <Icon name="rows" :size="14" />
        Split below
    </MenuItem>
    <MenuItem @click="emit('pick', 'width', width === 'contained' ? 'full' : 'contained')">
        <Icon :name="width === 'contained' ? 'wide' : 'narrow'" :size="14" />
        {{ width === "contained" ? "Fill" : "Contain" }}
    </MenuItem>
    <PaneMenuLink icon="arrow" label="Move to…" :disabled="!others.length || !title" @click="emit('open', 'move')" />
    <template v-if="floats">
        <MenuItem data-step="detach" :disabled="!title" @click="emit('pick', 'float')">
            <Icon name="float" :size="14" />
            Detach
        </MenuItem>
    </template>
    <PaneMenuLine />
    <MenuItem :disabled="!closable" @click="emit('pick', 'shut')">
        <Icon name="x" :size="14" />
        Close
    </MenuItem>
    <MenuItem @click="emit('pick', 'reset')">
        <Icon name="restore" :size="14" />
        Reset layout
    </MenuItem>
</template>
