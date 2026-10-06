<script setup>
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {store} from "../state/store.js";

const pick = (name) => (store.board.lens = {...store.board.lens, agent: store.board.lens.agent === name ? "" : name});
</script>

<template>
    <div class="strip">
        <template v-for="agent in store.board.agents" :key="agent.name">
            <div :class="['agent', {on: store.board.lens.agent === agent.name}]">
                <button type="button" class="pick" :title="`Show only ${agent.title}'s cards`" @click="pick(agent.name)">
                    <span :class="['dot', agent.status]" />
                    <span class="name">{{ agent.title }}</span>
                    <template v-if="agent.status === 'subagent'">
                        <span class="mark">subagent</span>
                    </template>
                    <template v-if="agent.todo">
                        <span class="works">#{{ agent.todo }}</span>
                    </template>
                </button>
                <button type="button" class="open" title="Open the agent" @click="peek('agent', agent.n)"><Icon name="open" /></button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.strip {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.agent {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 99px;
    background: var(--raised);
}

.agent.on {
    border-color: var(--accent);
}

.pick,
.open {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.pick {
    padding: 5px 4px 5px 10px;
}

.open {
    padding: 5px 9px 5px 4px;
    color: var(--text-3);
}

.open:hover {
    color: var(--text);
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-3);
}

.dot.working,
.dot.busy {
    background: var(--accent);
}

.dot.compacting {
    background: var(--blocking);
}

.dot.subagent {
    background: var(--created);
}

.mark,
.works {
    color: var(--text-3);
    font-size: 11px;
}
</style>
