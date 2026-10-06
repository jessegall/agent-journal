<script setup>
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import PaneMenuBack from "./PaneMenuBack.vue";

defineProps({title: {type: String, default: ""}, others: {type: Array, required: true}});
const emit = defineEmits(["back", "pick"]);
</script>

<template>
    <PaneMenuBack @click="emit('back')">Move {{ title }} to</PaneMenuBack>
    <template v-for="o in others" :key="o.id">
        <MenuItem @click="emit('pick', 'move', o.id)">
            <Icon :name="o.icon" :size="14" />
            {{ o.label }}
        </MenuItem>
    </template>
</template>
