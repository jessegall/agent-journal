<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import StateDot from "../kit/StateDot.vue";
import {agentState} from "../domain/ticketAgents.js";

const props = defineProps({cards: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const SHOWN = 3;
const menu = ref(false);
const more = ref(null);

function open(card) {
    menu.value = false;
    emit("open", card);
}
</script>

<template>
    <div class="working" aria-label="Agents working on this board's tickets">
        <template v-for="card in props.cards.slice(0, SHOWN)" :key="card.n">
            <Btn
                small
                :class="['agent', agentState(card).key]"
                :title="`#${card.n} ${card.title}: ${agentState(card).word}, ${card.reason}`"
                @click="open(card)"
            >
                <StateDot :state="agentState(card).dot" />
                <span class="n">#{{ card.n }}</span>
                <span class="name">{{ card.title }}</span>
                <template v-if="agentState(card).key !== 'working'">
                    <span class="word">{{ agentState(card).word }}</span>
                </template>
            </Btn>
        </template>
        <template v-if="props.cards.length > SHOWN">
            <span ref="more" class="more-agents">
                <Btn small title="The other agents working on this board" @click.stop="menu = !menu">
                    {{ props.cards.length - SHOWN }} more
                </Btn>
            </span>
        </template>
        <template v-if="menu">
            <MenuPanel :anchor="more" align="end" :min-width="260" :max-width="360" @click.stop @close="menu = false">
                <template v-for="card in props.cards.slice(SHOWN)" :key="card.n">
                    <MenuItem @click="open(card)">
                        <StateDot :state="agentState(card).dot" />
                        <span class="n">#{{ card.n }}</span>
                        <span class="name">{{ card.title }}</span>
                        <span class="word">{{ agentState(card).word }}</span>
                    </MenuItem>
                </template>
            </MenuPanel>
        </template>
    </div>
</template>

<style scoped>
.working {
    display: flex;
    flex: 1 1 0;
    align-items: center;
    gap: 6px;
    min-width: 180px;
}

.agent {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
}

.agent :deep(.btn-label) {
    min-width: 0;
}

.more-agents {
    flex: none;
}

.n {
    flex: none;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.name {
    min-width: 24px;
    max-width: 150px;
    overflow: hidden;
    color: var(--text);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.word {
    flex: none;
    color: var(--text-3);
    white-space: nowrap;
}

.agent.waiting .word {
    color: var(--tone-warn);
}

.agent.stuck .word {
    color: var(--danger);
}

.menu-item .name {
    flex: 1;
    max-width: none;
}

.menu-item .word {
    font-size: 11px;
}

@media (max-width: 640px) {
    .working {
        flex-basis: 100%;
        flex-wrap: wrap;
    }
}
</style>
