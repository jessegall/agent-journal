<script setup>
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import StageDot from "../kit/StageDot.vue";
import {moveEffect, refused} from "./moves.js";
import {computed, inject, ref} from "vue";
import {api} from "../api/client.js";
import {useOutside} from "../composables/outside.js";
import {peek} from "../route.js";
import {store} from "../state/store.js";

const props = defineProps({card: Object, anchor: {type: Object, default: null}});
const emit = defineEmits(["close"]);
const board = inject("board");
const menu = ref(null);
const slots = computed(() => store.board.slots);
const roles = computed(() => store.board.roles);
const TITLES = {todo: "To do", held: "Held", doing: "Doing", asked: "Needs you", done: "Done"};
useOutside(menu, () => emit("close"));

async function assign(body) {
    emit("close");
    await api.act("todo", props.card.n, "assign", body);
    board.refresh();
}

async function own(owner) {
    emit("close");
    await api.act("ticket", props.card.n, "update", {owner});
    board.refresh();
}

function move(lane) {
    emit("close");
    board.move(props.card, lane);
}
</script>

<template>
    <MenuPanel ref="menu" class="menu" :anchor="anchor" @click.stop>
        <template v-if="card.targets.length">
            <p class="label">Move to</p>
            <template v-for="lane in card.targets" :key="lane">
                <MenuItem :disabled="refused(card, board.meaningOf(lane))" @click="move(lane)">
                    <StageDot :meaning="board.meaningOf(lane)" />
                    {{ TITLES[lane] || lane }}
                    <span class="effect">{{ moveEffect(card, board.meaningOf(lane), slots) }}</span>
                </MenuItem>
            </template>
        </template>
        <template v-if="card.type === 'ticket' && roles.length">
            <p class="label">Assign to</p>
            <template v-for="role in roles" :key="role.name">
                <MenuItem @click="own(role.name)">{{ role.title }}</MenuItem>
            </template>
            <template v-if="card.assigned">
                <MenuItem @click="own('')">Unassign</MenuItem>
            </template>
        </template>
        <template v-if="card.type === 'todo' && store.board.agents.length">
            <p class="label">Assign to</p>
            <template v-for="agent in store.board.agents" :key="agent.name">
                <MenuItem @click="assign({to: agent.name})">{{ agent.title }}</MenuItem>
            </template>
            <template v-if="card.assigned">
                <MenuItem @click="assign({off: true})">Unassign</MenuItem>
            </template>
        </template>
        <template v-if="card.session">
            <MenuItem @click="(emit('close'), board.watchAgent(card))">Watch its agent</MenuItem>
        </template>
        <MenuItem class="open" @click="(emit('close'), peek(card.type, card.n))">Open</MenuItem>
    </MenuPanel>
</template>

<style scoped>
.menu {
    top: 30px;
    right: 6px;
    min-width: 170px;
    max-width: 240px;
}

.effect {
    margin-left: auto;
    padding-left: 12px;
    color: var(--text-4);
}

.label {
    margin: 6px 8px 2px;
    color: var(--text-3);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.open {
    margin-top: 4px;
    border-top: 1px solid var(--line);
    border-radius: 0 0 6px 6px;
}
</style>
