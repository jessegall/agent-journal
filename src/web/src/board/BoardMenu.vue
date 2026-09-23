<script setup>
import Icon from "../kit/Icon.vue";
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
    <MenuPanel ref="menu" class="menu" :anchor="anchor" align="left" @click.stop @close="emit('close')">
        <template v-if="board">
            <SectionHeading class="heading">{{ board.title }}</SectionHeading>
            <MenuItem @click="(emit('close'), peek('board', board.n))">Stages and what each means</MenuItem>
            <MenuItem @click="emit('archive', board)">Archive this board</MenuItem>
        </template>
        <template v-if="archived.length">
            <div :class="['archived', {apart: board}]">
                <SectionHeading class="heading">Archived boards</SectionHeading>
                <template v-for="archivedBoard in archived" :key="archivedBoard.n">
                    <MenuItem class="archived-board" @click="emit('restore', archivedBoard)">
                        <Icon name="board" />
                        <span class="name">{{ archivedBoard.title }}</span>
                        <span class="restore">Restore</span>
                    </MenuItem>
                </template>
            </div>
        </template>
    </MenuPanel>
</template>

<style scoped>
.menu {
    min-width: 210px;
    max-width: 280px;
}

.heading {
    margin: 6px 8px 2px;
    font-size: 11px;
}

.archived.apart {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid var(--border-2);
}

.archived-board {
    color: var(--text-3);
}

.name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.restore {
    color: var(--accent-text);
    font-size: 11px;
    opacity: 0;
    transition: opacity 0.12s;
}

.archived-board:hover .restore,
.archived-board:focus-visible .restore {
    opacity: 1;
}
</style>
