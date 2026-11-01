<script setup>
import {ref} from "vue";
import {ListTools, Skeleton, useListTools, useWindow} from "@journal/window-kit";

// dumps as version 4 drew them: a card for each with its title and brief, its items each with where the agent has got to
// (new, noted, filed, failed), the note or summary the agent left, and what it filed the item into; one read brings them all
const STATES = {new: "New", noted: "Noted", filed: "Filed", failed: "Failed"};
const context = useWindow();
const cards = ref([]);
const failure = ref("");
const loaded = ref(false);
const total = ref(0);
const tools = useListTools(cards, {title: (card) => card.title || `Dump ${card.id}`, isOpen: (card) => !card.outcome});

async function load() {
    const answer = await context.read("dump board");
    failure.value = answer.ok ? "" : answer.error;
    cards.value = answer.ok ? answer.value.dumps : [];
    total.value = answer.ok ? answer.value.total : 0;
    loaded.value = true;
}

async function more() {
    const answer = await context.read(`dump board --before ${Math.min(...cards.value.map((card) => card.id))}`);
    if (!answer.ok) return void (failure.value = answer.error);
    cards.value = [...cards.value, ...answer.value.dumps];
}

context.follow(["dump.*", "dump_item.*"], load);
load();
</script>

<template>
    <div class="dumps">
        <template v-if="!loaded">
            <Skeleton shape="cards" />
        </template>
        <template v-else-if="failure">
            <p class="dumps-note">{{ failure }}</p>
        </template>
        <template v-else-if="!cards.length">
            <p class="dumps-note">No dumps</p>
        </template>
        <ListTools :tools="tools" placeholder="Search the dumps" />
        <template v-for="card in tools.shown.value" :key="card.id">
            <section class="dump" :data-dump="card.id">
                <h3 class="dump-title">{{ card.title || `Dump ${card.id}` }}</h3>
                <p class="dump-brief">{{ card.outcome ? `Closed: ${card.outcome}` : card.brief }}</p>
                <template v-for="item in card.items" :key="item.id">
                    <div class="item" :data-item="item.id" :data-state="item.state">
                        <span :class="['item-state', item.state]">{{ STATES[item.state] || item.state }}</span>
                        <span class="item-text">{{ item.text }}</span>
                        <template v-if="item.summary || item.note">
                            <span class="item-note">{{ item.summary || item.note }}</span>
                        </template>
                        <template v-if="item.refs.length">
                            <span class="item-refs">Filed into {{ item.refs.join(", ") }}</span>
                        </template>
                    </div>
                </template>
            </section>
        </template>
        <template v-if="cards.length < total">
            <button type="button" class="dumps-more" @click="more">Show more</button>
        </template>
    </div>
</template>

<style scoped>
.dumps {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dump {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
}

.dump-title {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
}

.dumps-more {
    align-self: flex-start;
    color: var(--text-3);
    background: none;
    border: 0;
    cursor: pointer;
}

.dump-brief,
.dumps-note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.item {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 2px 10px;
    padding: 6px 0;
    border-top: 1px solid var(--border);
}

.item-state {
    grid-row: span 3;
    align-self: start;
    color: var(--text-3);
    font-size: 12px;
}

.item-state.filed {
    color: var(--accent-text);
}

.item-state.failed {
    color: var(--danger);
}

.item-note,
.item-refs {
    color: var(--text-3);
    font-size: 12px;
}
</style>
