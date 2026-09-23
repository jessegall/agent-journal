<script setup>
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import {ref} from "vue";
import {useOutside} from "../composables/outside.js";
import {peek} from "../route.js";

defineProps({board: {type: Object, default: null}, archived: {type: Array, required: true}, anchor: {type: Object, default: null}});
const emit = defineEmits(["close", "archive", "restore"]);
const menu = ref(null);
useOutside(menu, () => emit("close"));
</script>

<template>
    <MenuPanel ref="menu" class="menu" :anchor="anchor" @click.stop @close="emit('close')">
        <template v-if="board">
            <MenuItem @click="(emit('close'), peek('board', board.n))">Stages and what each means</MenuItem>
            <MenuItem @click="emit('archive', board)">Archive board</MenuItem>
        </template>
        <template v-if="archived.length">
            <SectionHeading class="heading">Archived boards</SectionHeading>
            <template v-for="archivedBoard in archived" :key="archivedBoard.n">
                <MenuItem @click="emit('restore', archivedBoard)">Restore {{ archivedBoard.title }}</MenuItem>
            </template>
        </template>
    </MenuPanel>
</template>

<style scoped>
.menu {
    min-width: 190px;
    max-width: 260px;
}

.heading {
    margin: 6px 8px 2px;
    font-size: 11px;
}
</style>
