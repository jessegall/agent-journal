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
const assignees = computed(() => (props.card.type === "todo" ? store.board.agents : []));
const TITLES = {todo: "To do", held: "Held", doing: "Doing", asked: "Needs you", done: "Done"};
useOutside(menu, () => emit("close"));

async function assign(name) {
    emit("close");
    await api.act(props.card.type, props.card.n, "assign", name ? {to: name} : {off: true});
    board.refresh();
}

function move(lane) {
    emit("close");
    board.move(props.card, lane);
}
</script>

<template>
    <MenuPanel ref="menu" :anchor="anchor" :min-width="170" :max-width="240" @click.stop @close="emit('close')">
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
        <template v-if="assignees.length">
            <p class="label">Assign to</p>
            <template v-for="who in assignees" :key="who.name">
                <MenuItem @click="assign(who.name)">{{ who.title }}</MenuItem>
            </template>
            <template v-if="card.assigned">
                <MenuItem @click="assign('')">Unassign</MenuItem>
            </template>
        </template>
        <template v-if="card.session">
            <MenuItem @click="(emit('close'), board.watchAgent(card))">Watch its agent</MenuItem>
        </template>
        <MenuItem class="open" @click="(emit('close'), peek(card.type, card.n))">Open</MenuItem>
    </MenuPanel>
</template>

<style scoped>
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
