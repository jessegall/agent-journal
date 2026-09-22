<script setup>
import {inject, ref} from "vue";
import {api} from "../api/client.js";
import {useOutside} from "../composables/outside.js";
import {peek} from "../route.js";
import {store} from "../state/store.js";

const props = defineProps({card: Object});
const emit = defineEmits(["close"]);
const board = inject("board");
const menu = ref(null);
const TITLES = {todo: "To do", held: "Held", doing: "Doing", asked: "Needs you", done: "Done"};
useOutside(menu, () => emit("close"));

async function assign(body) {
    emit("close");
    await api.act("todo", props.card.n, "assign", body);
    board.refresh();
}

function move(lane) {
    emit("close");
    board.move(props.card, lane);
}
</script>

<template>
    <div ref="menu" class="menu" @click.stop>
        <template v-if="card.targets.length">
            <p class="label">Move to</p>
            <template v-for="lane in card.targets" :key="lane">
                <button type="button" class="entry" @click="move(lane)">{{ TITLES[lane] }}</button>
            </template>
        </template>
        <template v-if="store.board.agents.length">
            <p class="label">Assign to</p>
            <template v-for="agent in store.board.agents" :key="agent.name">
                <button type="button" class="entry" @click="assign({to: agent.name})">{{ agent.name }}</button>
            </template>
            <template v-if="card.assigned">
                <button type="button" class="entry" @click="assign({off: true})">Unassign</button>
            </template>
        </template>
        <button type="button" class="entry open" @click="(emit('close'), peek('todo', card.n))">Open</button>
    </div>
</template>

<style scoped>
.menu {
    position: absolute;
    top: 30px;
    right: 6px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    min-width: 170px;
    max-width: 240px;
    padding: 6px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--side);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.label {
    margin: 6px 8px 2px;
    color: var(--text-3);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.entry {
    overflow: hidden;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.entry:hover {
    background: var(--hover);
}

.open {
    margin-top: 4px;
    border-top: 1px solid var(--line);
    border-radius: 0 0 6px 6px;
}
</style>
