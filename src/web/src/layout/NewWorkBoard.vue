<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import MenuChoice from "../kit/MenuChoice.vue";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

const emit = defineEmits(["failed"]);
const NONE = "";
const boards = computed(() => rows("board").filter((board) => !board.completed && !board.deleted));
const options = computed(() => [{value: NONE, label: "No board"}, ...boards.value.map((board) => ({value: String(board.n), label: board.title}))]);
const current = computed(() => String(store.settings.work_modes.board || NONE));
const keep = (n) => (store.settings = {...store.settings, work_modes: {...store.settings.work_modes, board: n}});

async function pick(value) {
    const was = store.settings.work_modes.board;
    keep(Number(value));
    try {
        await api.saveNewWorkBoard(Number(value));
    } catch (e) {
        keep(was);
        emit("failed", e.message);
    }
}
</script>

<template>
    <span class="new-work-board" title="The board the orchestrating agent files new requests on, as tickets; with No board they become to-dos">
        <MenuChoice :options="options" :value="current" empty="No board" prefix="Board" @pick="pick" />
    </span>
</template>

<style scoped>
.new-work-board {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
}
</style>
